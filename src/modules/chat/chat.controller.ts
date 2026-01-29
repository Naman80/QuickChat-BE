import { z } from "zod";
import { WebSocket, type RawData } from "ws";
import { ChatService } from "./chat.service.ts";
import type { TWsInboundMessage } from "../../websocket/schemas/ws.inboundMessages.schema.ts";
import { validateWsInboundMessage } from "../../websocket/ws.validation.ts";
import { WsInboundEvents, WsOutboundEvents } from "../../websocket/ws.types.ts";
import { WebsocketUtils } from "../../websocket/ws.util.ts";

// Chat Controller is for Real-time communication handling.
// To handle conversations data, please look at conversation.controller.ts
export function handleChatMessage(ws: WebSocket, rawData: RawData) {
  let message: TWsInboundMessage;

  try {
    message = validateWsInboundMessage(rawData);

    console.log("WS Validated Message: ", message);

    switch (message.type) {
      case WsInboundEvents.JOIN_ROOM:
        ChatService.handleJoinRoom({ ws, message });
        break;

      case WsInboundEvents.SEND_MESSAGE:
        ChatService.handleSendMessage({ ws, message });
        break;

      default:
        throw new Error("Unknown message type");
    }
  } catch (err: any) {
    WebsocketUtils.sendMessage(ws, {
      type: WsOutboundEvents.ERROR,
      payload: {
        message:
          z.prettifyError({ issues: [{ message: err.message }] }) ??
          "Error in WS message",
      },
    });

    console.error("Error in WS message: " + err);
  }
}
