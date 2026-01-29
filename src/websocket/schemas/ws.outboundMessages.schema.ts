import { z } from "zod";
import { WsOutboundEvents } from "../ws.types.ts";

// ================= USER JOINED =========================

const WsUserJoinedSchema = z.object({
  type: z.literal(WsOutboundEvents.USER_JOINED),
  payload: z.object({
    conversationId: z.string().uuid(),
  }),
});

// ================= NEW MESSAGE =========================

const WsNewMessageSchema = z.object({
  type: z.literal(WsOutboundEvents.NEW_MESSAGE),
  payload: z.object({
    conversationId: z.string().uuid(),
    message: z.any(),
  }),
});

export type TWsNewMessage = z.infer<typeof WsNewMessageSchema>;

// ================= MESSAGE ACK =========================

const WsMessageAckSchema = z.object({
  type: z.literal(WsOutboundEvents.MESSAGE_ACK),
  payload: z.object({
    conversationId: z.string().uuid(),
    message: z.any(),
  }),
});

// ================= ERROR =========================

const WsErrorSchema = z.object({
  type: z.literal(WsOutboundEvents.ERROR),
  payload: z.object({
    message: z.string(),
    code: z.string().optional(),
  }),
});

// =============== UNION =========================

export const WsOutboundMessageSchema = z.discriminatedUnion("type", [
  WsUserJoinedSchema,
  WsNewMessageSchema,
  WsMessageAckSchema,
  WsErrorSchema,
]);

export type TWsOutboundMessage = z.infer<typeof WsOutboundMessageSchema>;
