import { z } from "zod";
import { createEnumSchema } from "../../../utils/zod.helper.ts";
import { MessageSchema } from "./messageType.schema.ts";

export const RecipientType = {
  Individual: "individual",
  Group: "group",
} as const;

export type TRecipientType = (typeof RecipientType)[keyof typeof RecipientType];

export const recipientTypeSchema = createEnumSchema(RecipientType);

export const sendMessageBodySchema = z.object({
  recipient_type: recipientTypeSchema,
  to: z.string().min(1),
  message: MessageSchema,
});

export const sendMessageRequestSchema = z.object({
  body: sendMessageBodySchema,
});

export type TSendMessageRequest = z.infer<typeof sendMessageRequestSchema>;
export type TSendMessageBody = z.infer<typeof sendMessageBodySchema>;
