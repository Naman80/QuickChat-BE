import { z } from "zod";
import { createEnumSchema } from "../../../utils/zod.helper.ts";

export const MessageType = {
  Text: "text",
  Image: "image",
} as const;
export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export const messageTypeSchema = createEnumSchema(MessageType);

const TextMessageSchema = z.object({
  type: z.literal(MessageType.Text),
  text: z.object({
    body: z.string().min(1),
  }),
});

const ImageMessageSchema = z.object({
  type: z.literal(MessageType.Image),
  image: z.object({
    url: z.string().url(),
    caption: z.string().optional(),
  }),
});

export const MessageSchema = z.discriminatedUnion("type", [
  TextMessageSchema,
  ImageMessageSchema,
]);

export type MessagePayload = z.infer<typeof MessageSchema>;
