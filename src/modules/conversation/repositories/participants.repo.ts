import type { ParticipantRole } from "../../../../generated/prisma/enums.ts";
import type {
  ConversationParticipantCreateManyInput,
  ConversationParticipantSelect,
  TransactionClient,
} from "../../../../generated/prisma/internal/prismaNamespace.ts";
import { prisma } from "../../../db/prisma.ts";

export const ParticipantRepo = {
  async getParticipantConversations(
    userId: string,
    select?: ConversationParticipantSelect,
    tx?: TransactionClient,
  ) {
    const db = tx || prisma;
    return db.conversationParticipant.findMany({
      where: {
        userId,
      },
      orderBy: {
        conversation: {
          updatedAt: "desc",
        },
      },
      take: 30,
      select: {
        unreadCount: true,
        conversation: {
          select: {
            id: true,
            type: true,
            updatedAt: true,
            lastMessage: {
              select: {
                content: true,
                contentType: true,
                createdAt: true,
              },
            },
            conversationParticipants: {
              where: { userId: { not: userId } },
              select: {
                user: {
                  select: {
                    name: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  async getParticipants(
    conversationId: string,
    select?: ConversationParticipantSelect,
    tx?: TransactionClient,
  ) {
    const db = tx || prisma;
    return db.conversationParticipant.findMany({
      where: {
        conversationId,
      },
      select: { ...(select ?? {}) },
    });
  },

  async getParticipant(
    conversationId: string,
    userId: string,
    tx?: TransactionClient,
  ) {
    const db = tx || prisma;
    return db.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });
  },

  async createParticipant(
    conversationId: string,
    userId: string,
    role: ParticipantRole = "member",
    tx?: TransactionClient,
  ) {
    const db = tx || prisma;
    return db.conversationParticipant.create({
      data: {
        conversationId,
        userId,
        role,
      },
    });
  },

  async createMany(
    data: ConversationParticipantCreateManyInput[],
    tx?: TransactionClient,
  ) {
    const db = tx || prisma;
    return db.conversationParticipant.createMany({
      data,
      skipDuplicates: true,
    });
  },

  incrementUnreadForOthers(
    conversationId: string,
    senderId: string,
    tx?: TransactionClient,
  ) {
    const db = tx || prisma;

    return db.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId: { not: senderId },
      },
      data: {
        unreadCount: { increment: 1 },
      },
    });
  },

  async markRead(
    conversationId: string,
    userId: string,
    messageId: string,
    tx?: TransactionClient,
  ) {
    const db = tx || prisma;
    return db.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      data: {
        lastReadMessageId: messageId,
        unreadCount: 0,
      },
    });
  },
};
