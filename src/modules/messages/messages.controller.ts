import type { TypedController } from "../../middlewares/validation/typed.controller.ts";
import type { TSendMessageRequest } from "./schemas/messages.schema.ts";
import { MessageService } from "./messages.service.ts";

export const sendMessage: TypedController<TSendMessageRequest> = async (
  _req,
  res,
) => {
  const { body } = res.locals.validated;
  const { id: senderId } = res.locals.user;

  const conversation = await MessageService.sendMessage(senderId, body);

  res.status(201).json(conversation);
};
