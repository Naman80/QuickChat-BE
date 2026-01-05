import { WebSocket, WebSocketServer, type RawData } from "ws";
import type { WSMessage } from "../../websocket/ws.types.ts";
import { WS_EVENTS } from "../../websocket/ws.events.ts";
import { handleJoinRoom, handleSendMessage } from "./chat.service.ts";

export function handleChatMessage(
  ws: WebSocket,
  rawData: RawData,
  wss: WebSocketServer
) {
  let message: WSMessage;

  try {
    message = JSON.parse(rawData.toString());
  } catch {
    ws.send(JSON.stringify({ type: WS_EVENTS.ERROR, payload: "Invalid JSON" }));
    return;
  }

  switch (message.type) {
    case WS_EVENTS.JOIN_ROOM:
      handleJoinRoom(ws, message);
      break;

    case WS_EVENTS.SEND_MESSAGE:
      handleSendMessage(ws, message);
      break;

    default:
      ws.send(
        JSON.stringify({
          type: WS_EVENTS.ERROR,
          payload: "Unknown message type",
        })
      );
  }
}
