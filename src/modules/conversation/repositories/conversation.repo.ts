import { prisma } from "../../../db/prisma.ts";
import type {
  ConversationCreateInput,
  ConversationSelect,
  TransactionClient,
} from "../../../../generated/prisma/internal/prismaNamespace.ts";
import type { ConversationUpdateInput } from "../../../../generated/prisma/models.ts";

export const ConversationRepo = {
  createConversation(
    data: ConversationCreateInput,
    select?: ConversationSelect,
    tx?: TransactionClient,
  ) {
    const db = tx || prisma;
    return db.conversation.create({
      data,
      select: { ...(select ?? {}) },
    });
  },

  getConversationById(id: string, select?: ConversationSelect) {
    return prisma.conversation.findUnique({
      where: { id },
      select: { ...(select ?? {}) },
    });
  },

  getConversationByDirectKey(
    directKey: string,
    select?: ConversationSelect,
    tx?: TransactionClient,
  ) {
    const db = tx || prisma;
    return db.conversation.findFirst({
      where: { directKey },
      select: { ...(select ?? {}) },
    });
  },

  updateConversation(
    id: string,
    data: ConversationUpdateInput,
    tx?: TransactionClient,
  ) {
    const db = tx || prisma;
    return db.conversation.update({
      where: { id },
      data,
    });
  },

  deleteConversation(id: string) {
    return prisma.conversation.delete({
      where: { id },
    });
  },

  updateConversationLastMessage(
    conversationId: string,
    messageId: string,
    tx?: TransactionClient,
  ) {
    const db = tx || prisma;
    return db.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageId: messageId,
      },
    });
  },
};
