import type { TypedController } from "../../middlewares/validation/typed.controller.ts";
import type { CreateConversationRequest } from "./conversation.schema.ts";

import { ConversationService } from "./conversation.service.ts";

export const createConversation: TypedController<
  CreateConversationRequest
> = async (_req, res) => {
  const { body } = res.locals.validated;

  const conversation = await ConversationService.createConversation(body);

  res.status(201).json(conversation);
};
