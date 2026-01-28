import { z } from "zod";
import { createEnumSchema } from "../../utils/zod.helper.ts";

export const RecipientType = {
  Individual: "individual",
  Group: "group",
} as const;

export const recipientTypeSchema = createEnumSchema(RecipientType);
export type RecipientType = (typeof RecipientType)[keyof typeof RecipientType];

export const MessageType = {
  Text: "text",
} as const;

export const messageTypeSchema = createEnumSchema(MessageType);

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export const sendMessageBodySchema = z.object({
  // TODO: enum
  recipient_type: recipientTypeSchema,
  to: z.string().min(1),
  type: messageTypeSchema,
  text: z.object({
    body: z.string().min(1),
  }),
});

export const sendMessageRequestSchema = z.object({
  body: sendMessageBodySchema,
});

export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;
export type SendMessageBody = z.infer<typeof sendMessageBodySchema>;
