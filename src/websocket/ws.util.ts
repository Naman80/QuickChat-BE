import type { WebSocket } from "ws";
import {
  WsOutboundMessageSchema,
  type TWsOutboundMessage,
} from "./schemas/ws.outboundMessages.schema.ts";

export const WebsocketUtils = {
  sendMessage<T extends TWsOutboundMessage>(ws: WebSocket, message: T) {
    // runtime validation (dev + prod safe)
    WsOutboundMessageSchema.parse(message);

    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  },
};
