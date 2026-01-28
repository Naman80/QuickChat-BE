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
import { MessageUserStateRepo } from "./repositories/messageUserState.repo.ts";
import { RecipientType, type SendMessageBody } from "./messages.schema.ts";

export const MessageService = {
  async sendMessage(senderId: string, message: SendMessageBody) {
    console.time("sendMessageTime");

    // -----------------------------
    // Phase 1: Resolve intent (READ-ONLY)
    // -----------------------------
    let receiverId: string | null = null;
    let conversationId: string | null = null;
    let directKey: string | null = null;

    if (message.recipient_type === RecipientType.Individual) {
      // get receiver data
      const receiver = await UserRepo.getUserByPhone(message.to, { id: true });

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
        { id: true },
      );

      if (conversation) conversationId = conversation.id;
    } else {
      const conversation = await ConversationRepo.getConversationById(
        message.to,
        { id: true },
      );
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      conversationId = conversation.id;

      const isParticipant = await ParticipantRepo.getParticipant(
        conversationId,
        senderId,
      );

      if (!isParticipant) {
        throw new Error("Sender is not a participant of this conversation");
      }
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
              data: {
                directKey,
                type: ConversationType.direct,
              },
              select: { id: true },
            },
            tx,
          );

          conversationId = conversation.id;
        } catch (err: any) {
          // another request created it concurrently
          const existingConversation =
            await ConversationRepo.getConversationByDirectKey(
              directKey!,
              { id: true },
              tx,
            );

          if (!existingConversation) {
            throw new Error("Conversation not found while sending message");
          }

          conversationId = existingConversation.id;
        }

        await ParticipantRepo.createMany(
          [
            {
              conversationId,
              userId: senderId,
              role: ParticipantRole.member,
            },
            {
              conversationId,
              userId: receiverId!,
              role: ParticipantRole.member,
            },
          ],
          tx,
        );
      }

      const createNewMessage = MessageRepo.createMessage(tx, {
        conversationId,
        senderId,
        content: message.text.body,
      });

      const getParticipants = ParticipantRepo.getParticipants(
        conversationId,
        tx,
      );

      const [newMessage, participants] = await Promise.all([
        createNewMessage,
        getParticipants,
      ]);

      const messageUserStates = participants.map((p) => ({
        messageId: newMessage.id,
        userId: p.userId,
        status: p.userId === senderId ? MessageStatus.read : MessageStatus.sent,
      }));

      // Create message user states
      const createMessageUserStates = MessageUserStateRepo.createMany(
        tx,
        messageUserStates,
      );

      // Update senders last read message
      const updatingSendersLastReadMessage = ParticipantRepo.markRead(
        conversationId,
        senderId,
        newMessage.id,
        tx,
      );

      // Increment unread count for all others
      const updatingUnreadCounts = ParticipantRepo.incrementUnreadForOthers(
        conversationId,
        senderId,
        tx,
      );

      // Update conversation last message
      const updatingConversationLastMessage =
        ConversationRepo.updateConversationLastMessage(
          conversationId,
          newMessage.id,
          tx,
        );

      await Promise.all([
        createMessageUserStates,
        updatingSendersLastReadMessage,
        updatingUnreadCounts,
        updatingConversationLastMessage,
      ]);

      return { message: newMessage, participants };
    });

    console.timeEnd("sendMessageTime");

    // -----------------------------
    // Realtime fan-out (outside tx)
    // -----------------------------
    return {
      conversationId,
      message: result.message,
      participants: result.participants.map((p) => p.userId),
    };
  },
};
