import { ConversationRepo } from "./conversation.repo.ts";
import type { CreateConversationBody } from "./conversation.schema.ts";

export const ConversationService = {
  async createConversation({ type }: CreateConversationBody) {
    const conversation = await ConversationRepo.createConversation({
      type,
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
