import { TypedController } from "../../middlewares/validation/typed.controller.ts";
import type { CreateConversationRequest } from "./conversation.schema.ts";

import { ConversationService } from "./conversation.service.ts";

export const ConversationController = {
  createConversation: TypedController<CreateConversationRequest>(
    async (req, res) => {
      const { body } = res.locals.validated;

      const conversation = await ConversationService.createConversation(body);

      res.status(201).json(conversation);
    },
  ),

  getConversations: TypedController(async (req, res) => {
    const { user } = res.locals;
    const conversations = await ConversationService.getConversations({
      userId: user.id,
    });

    res.status(200).json(conversations);
  }),
};
