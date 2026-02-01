import { Router } from "express";
import { validateHttp } from "../../middlewares/validation/validate.http.ts";
import { sendMessageRequestSchema } from "./schemas/messages.schema.ts";
import { MessageController } from "./messages.controller.ts";

const router = Router();

router.post(
  "/",
  validateHttp(sendMessageRequestSchema),
  MessageController.sendMessage,
);

export default router;
