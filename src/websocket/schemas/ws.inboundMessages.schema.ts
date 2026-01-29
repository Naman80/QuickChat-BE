import { z } from "zod";
import { WsInboundEvents } from "../ws.types.ts";
import { MessageSchema } from "../../modules/messages/schemas/messageType.schema.ts";

// ================= JOIN ROOM =========================

const WsJoinRoomSchema = z.object({
  type: z.literal(WsInboundEvents.JOIN_ROOM),
  payload: z.object({
    conversationId: z.uuid(),
  }),
});

export type TWsJoinRoom = z.infer<typeof WsJoinRoomSchema>;

// ================= LEAVE ROOM =========================

const WsLeaveRoomSchema = z.object({
  type: z.literal(WsInboundEvents.LEAVE_ROOM),
  payload: z.object({
    conversationId: z.uuid(),
  }),
});

export type TWsLeaveRoom = z.infer<typeof WsLeaveRoomSchema>;

// ================= SEND MESSAGE =========================

const WsBaseSendMessage = z.object({
  type: z.literal(WsInboundEvents.SEND_MESSAGE),
  payload: z.object({
    message: MessageSchema,
  }),
});

const WsSendMessageToIndividual = WsBaseSendMessage.extend({
  payload: WsBaseSendMessage.shape.payload.extend({
    to: z.string().min(1),
  }),
});

const WsSendMessageToGroup = WsBaseSendMessage.extend({
  payload: WsBaseSendMessage.shape.payload.extend({
    conversationId: z.uuid(),
  }),
});

export const WsSendMessageSchema = z.discriminatedUnion("payload", [
  WsSendMessageToIndividual,
  WsSendMessageToGroup,
]);

export type TWsSendMessage = z.infer<typeof WsSendMessageSchema>;

// ================= FINAL UNION INCOMING/OUTGOING WS MESSAGE =========================

export const WsInboundMessageSchema = z.discriminatedUnion("type", [
  WsJoinRoomSchema,
  WsLeaveRoomSchema,
  WsSendMessageSchema,
]);

export type TWsInboundMessage = z.infer<typeof WsInboundMessageSchema>;
