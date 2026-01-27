import { Router } from "express";
import { validateHttp } from "../../middlewares/validation/validate.http.ts";
import { createConversationRequestSchema } from "./conversation.schema.ts";
import { createConversation } from "./conversation.controller.ts";

const router = Router();

router.post(
  "/",
  validateHttp(createConversationRequestSchema),
  createConversation,
);

export default router;
