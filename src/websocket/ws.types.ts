// =======================
// In-Bound WebSocket Events
// =====================

export const WsInboundEvents = {
  JOIN_ROOM: "JOIN_ROOM",
  LEAVE_ROOM: "LEAVE_ROOM",
  SEND_MESSAGE: "SEND_MESSAGE",
} as const;

export type TWsInboundEvents =
  (typeof WsInboundEvents)[keyof typeof WsInboundEvents];

// =======================
// Out-Bound WebSocket Events
// =====================

export const WsOutboundEvents = {
  NEW_MESSAGE: "NEW_MESSAGE",
  MESSAGE_ACK: "MESSAGE_ACK",
  USER_JOINED: "USER_JOINED",
  ERROR: "ERROR",
} as const;

export type TWsOutboundEvents =
  (typeof WsOutboundEvents)[keyof typeof WsOutboundEvents];
