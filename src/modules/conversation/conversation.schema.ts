import { z } from "zod";

export const createConversationBodySchema = z.object({
  type: z.enum(["direct", "group"]),
});

export const createConversationRequestSchema = z.object({
  body: createConversationBodySchema,
});

export type CreateConversationBody = z.infer<
  typeof createConversationBodySchema
>;
export type CreateConversationRequest = z.infer<
  typeof createConversationRequestSchema
>;
