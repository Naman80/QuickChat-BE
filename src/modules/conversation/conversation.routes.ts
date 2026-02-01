import { Router } from "express";
import { validateHttp } from "../../middlewares/validation/validate.http.ts";
import { createConversationRequestSchema } from "./conversation.schema.ts";
import { ConversationController } from "./conversation.controller.ts";

const router = Router();

router
  .post(
    "/",
    validateHttp(createConversationRequestSchema),
    ConversationController.createConversation,
  )
  .get("/", ConversationController.getConversations);

export default router;
