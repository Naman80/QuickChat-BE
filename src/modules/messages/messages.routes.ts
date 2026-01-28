import { Router } from "express";
import { validateHttp } from "../../middlewares/validation/validate.http.ts";
import { sendMessageRequestSchema } from "./messages.schema.ts";
import { sendMessage } from "./messages.controller.ts";

const router = Router();

router.post("/", validateHttp(sendMessageRequestSchema), sendMessage);

export default router;
