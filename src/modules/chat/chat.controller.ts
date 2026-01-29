import { WebSocket, type RawData } from "ws";
import { WsEvents, type TWsMessage } from "../../websocket/ws.types.ts";
import { validateWsMessage } from "../../websocket/ws.validation.ts";
import { ChatService } from "./chat.service.ts";

// Chat Controller is for Real-time communication handling.
// To handle conversations data, please look at conversation.controller.ts
export function handleChatMessage(ws: WebSocket, rawData: RawData) {
  let message: TWsMessage;

  try {
    message = validateWsMessage(rawData);
    console.log("WS Validated Message: ", message);
    switch (message.type) {
      case WsEvents.JOIN_ROOM:
        ChatService.handleJoinRoom({ ws, message });
        break;

      case WsEvents.SEND_MESSAGE:
        ChatService.handleSendMessage({ ws, message });
        break;

      default:
        throw new Error("Unknown message type");
    }
  } catch (err: any) {
    ws.send(
      JSON.stringify({
        type: WsEvents.ERROR,
        payload: err.message ?? "Invalid message",
      }),
    );

    console.error("Error in WS message", err.message);
  }
}
