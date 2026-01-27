import type {
  ConversationCreateInput,
  ConversationUpdateInput,
} from "../../../generated/prisma/models.ts";
import { prisma } from "../../db/prisma.ts";

export const ConversationRepo = {
  createConversation(data: ConversationCreateInput) {
    return prisma.conversation.create({
      data,
    });
  },

  getConversationById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
    });
  },

  updateConversation(id: string, data: ConversationUpdateInput) {
    return prisma.conversation.update({
      where: { id },
      data,
    });
  },

  deleteConversation(id: string) {
    return prisma.conversation.delete({
      where: { id },
    });
  },
};
