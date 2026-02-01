import { prisma } from "../../db/prisma.ts";
import {
  ConversationType,
  MessageStatus,
  ParticipantRole,
} from "../../../generated/prisma/enums.ts";
import { UserRepo } from "../user/user.repo.ts";
import { ConversationRepo } from "../conversation/repositories/conversation.repo.ts";
import { ParticipantRepo } from "../conversation/repositories/participants.repo.ts";
import { ConversationUtils } from "../conversation/conversation.utils.ts";
import { MessageRepo } from "./repositories/messages.repo.ts";
import {
  RecipientType,
  type TSendMessageBody,
} from "./schemas/messages.schema.ts";
import type { ConversationParticipant } from "../../../generated/prisma/client.ts";
import { MessageType } from "./schemas/messageType.schema.ts";

export const MessageService = {
  async sendMessage(senderId: string, messageBody: TSendMessageBody) {
    const { recipient_type, to, message } = messageBody;
    console.time("sendMessageTime");

    // -----------------------------
    // Phase 1: Resolve intent (READ-ONLY)
    // -----------------------------
    let receiverId: string | null = null;
    let conversationId: string | null = null;
    let directKey: string | null = null;
    let conversationParticipants: ConversationParticipant[] = [];

    if (recipient_type === RecipientType.Individual) {
      // get receiver data
      const receiver = await UserRepo.getUserByPhone(to, { id: true });

      if (!receiver) {
        throw new Error("Receiver not found");
      }
      if (receiver.id === senderId) {
        throw new Error("Cannot message yourself");
      }
      receiverId = receiver.id;

      directKey = ConversationUtils.generateDirectKey(senderId, receiverId);

      const conversation = await ConversationRepo.getConversationByDirectKey(
        directKey,
        { id: true, conversationParticipants: { select: { userId: true } } },
      );

      if (conversation) {
        conversationId = conversation.id;
        conversationParticipants = conversation.conversationParticipants;
      }
    } else {
      const conversation = await ConversationRepo.getConversationById(to, {
        id: true,
        conversationParticipants: { select: { userId: true } },
      });

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      const isParticipant = conversation.conversationParticipants.some(
        (participant) => participant.userId === senderId,
      );

      if (!isParticipant) {
        throw new Error("Sender is not a participant of this conversation");
      }

      conversationId = conversation.id;
      conversationParticipants = conversation.conversationParticipants;
    }

    // -----------------------------
    // Transactional message pipeline
    // -----------------------------
    const result = await prisma.$transaction(async (tx) => {
      if (!conversationId) {
        // CASE : What if two user send new message to each other at the same time - use try/catch
        // Create conversation
        try {
          const conversation = await ConversationRepo.createConversation(
            {
              directKey,
              type: ConversationType.direct,
              conversationParticipants: {
                createMany: {
                  data: [
                    {
                      userId: senderId,
                      role: ParticipantRole.member,
                    },
                    {
                      userId: receiverId!,
                      role: ParticipantRole.member,
                    },
                  ],
                  skipDuplicates: true,
                },
              },
            },
            {
              id: true,
              conversationParticipants: { select: { userId: true } },
            },
            tx,
          );
          console.log(conversation, "this is new conversation CREATEAD");

          conversationId = conversation.id;
          conversationParticipants = conversation.conversationParticipants;
        } catch (err: any) {
          // another request created it concurrently
          const existingConversation =
            await ConversationRepo.getConversationByDirectKey(
              directKey!,
              {
                id: true,
                conversationParticipants: { select: { userId: true } },
              },
              tx,
            );

          if (!existingConversation) {
            throw new Error("Conversation not found while sending message");
          }

          conversationId = existingConversation.id;
          conversationParticipants =
            existingConversation.conversationParticipants;
        }
      }

      // TODO : have to handle more message types in future
      if (message.type !== MessageType.Text) {
        throw new Error("Message type not supported");
      }

      const newMessage = await MessageRepo.createMessage(
        {
          conversationId,
          senderId,
          contentType: message.type,
          content: message.text.body,
          messageUserStates: {
            createMany: {
              // creating message user states here only
              data: conversationParticipants.map((p) => ({
                userId: p.userId,
                status:
                  p.userId === senderId
                    ? MessageStatus.read
                    : MessageStatus.sent,
              })),
            },
          },
          participantLastReadMessage: {
            // marking the senders last message
            connect: {
              conversationId_userId: {
                conversationId,
                userId: senderId,
              },
              unreadCount: 0,
            },
          },

          lastMessage: {
            // marking the last message of conversation
            connect: { id: conversationId },
          },
        },
        tx,
      );

      // Increment unread count for all others
      await ParticipantRepo.incrementUnreadForOthers(
        conversationId,
        senderId,
        tx,
      );

      return { message: newMessage, participants: conversationParticipants };
    });

    console.timeEnd("sendMessageTime");

    // -----------------------------
    // Realtime fan-out (outside tx)
    // -----------------------------
    return {
      conversationId: conversationId!,
      message: result.message,
      participants: result.participants.map((p) => p.userId),
    };
  },
};
