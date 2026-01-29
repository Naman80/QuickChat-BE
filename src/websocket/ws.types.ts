import { z } from "zod";
import { MessageSchema } from "../modules/messages/schemas/messageType.schema.ts";

export const WsEvents = {
  JOIN_ROOM: "JOIN_ROOM",
  LEAVE_ROOM: "LEAVE_ROOM",
  SEND_MESSAGE: "SEND_MESSAGE",
  NEW_MESSAGE: "NEW_MESSAGE",
  MESSAGE_SENT: "MESSAGE_SENT",
  USER_JOINED: "USER_JOINED",
  ERROR: "ERROR",
} as const;

// Convert object key in a type
export type TWsEvents = (typeof WsEvents)[keyof typeof WsEvents];

// ================= JOIN ROOM =========================

const WsJoinRoomSchema = z.object({
  type: z.literal(WsEvents.JOIN_ROOM),
  payload: z.object({
    conversationId: z.uuid(),
  }),
});

export type TWsJoinRoom = z.infer<typeof WsJoinRoomSchema>;

// ================= LEAVE ROOM =========================

const WsLeaveRoomSchema = z.object({
  type: z.literal(WsEvents.LEAVE_ROOM),
  payload: z.object({
    conversationId: z.uuid(),
  }),
});

export type TWsLeaveRoom = z.infer<typeof WsLeaveRoomSchema>;

// ================= SEND MESSAGE =========================

const WsBaseSendMessage = z.object({
  type: z.literal(WsEvents.SEND_MESSAGE),
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

export const WsMessageSchema = z.discriminatedUnion("type", [
  WsJoinRoomSchema,
  WsLeaveRoomSchema,
  WsSendMessageSchema,
]);

export type TWsMessage = z.infer<typeof WsMessageSchema>;
