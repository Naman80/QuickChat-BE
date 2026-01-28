import type {
  ConversationCreateArgs,
  ConversationSelect,
  TransactionClient,
} from "../../../../generated/prisma/internal/prismaNamespace.ts";
import type { ConversationUpdateInput } from "../../../../generated/prisma/models.ts";
import { prisma } from "../../../db/prisma.ts";

export const ConversationRepo = {
  createConversation(data: ConversationCreateArgs, tx?: TransactionClient) {
    const db = tx || prisma;
    return db.conversation.create({ ...data });
  },

  getConversationById(id: string, select?: ConversationSelect) {
    return prisma.conversation.findUnique({
      where: { id },
      select: select ?? null,
    });
  },

  getConversationByDirectKey(
    directKey: string,
    select?: ConversationSelect,
    tx?: TransactionClient,
  ) {
    const db = tx || prisma;
    return db.conversation.findUnique({
      where: { directKey },
      select: select ?? null,
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
