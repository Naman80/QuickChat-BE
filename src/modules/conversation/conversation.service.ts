import { ConversationType } from "../../../generated/prisma/enums.ts";
import type { CreateConversationBody } from "./conversation.schema.ts";
import { ConversationRepo } from "./repositories/conversation.repo.ts";

export const ConversationService = {
  async createConversation({ type }: CreateConversationBody) {
    const conversation = await ConversationRepo.createConversation({
      data: { type: ConversationType.direct },
    });

    return conversation;
  },

  async getConversationById(id: string) {
    return await ConversationRepo.getConversationById(id);
  },

  updateConversation(id: string, data: Partial<CreateConversationBody>) {
    return ConversationRepo.updateConversation(id, data);
  },

  deleteConversation(id: string) {
    return ConversationRepo.deleteConversation(id);
  },
};
