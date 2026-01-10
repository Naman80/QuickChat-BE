import { WebSocketServer, WebSocket } from "ws";
import { handleChatMessage } from "../modules/chat/chat.controller.ts";
import {
  registerWsConnection,
  removeWsConnection,
} from "../store/connection.store.ts";
import { randomUUID } from "crypto";
import { removeClientFromRooms } from "../store/rooms.store.ts";
import { authenticateWs } from "./ws.auth.ts";

export function handleConnection(
  ws: WebSocket,
  req: any,
  wss: WebSocketServer
) {
  console.log("New WS connection");
  console.log("Number of ws clients connected", wss.clients.size);

  try {
    // this is not coorect blocker for ws request to connect // TODO : fix this
    const userId = authenticateWs(req);

    // user will have some userId
    // const userId = randomUUID();
    // managing ws connections - custom logic
    registerWsConnection(ws, userId);

    ws.on("message", (data) => {
      handleChatMessage(ws, data, wss);
    });

    ws.on("close", () => {
      // close that connection here only first thing
      ws.close();
      // then perform further operations on it.

      // remove ws from all rooms
      removeClientFromRooms(ws); // first cuz we want to get all the rooms

      // remove connections
      removeWsConnection(ws); // second : deleting entire ws related data

      console.log("WS connection closed");
    });
  } catch {
    ws.close();

    return;
  }
}
