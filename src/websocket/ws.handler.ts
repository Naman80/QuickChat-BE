import { WebSocketServer, WebSocket } from "ws";
import { handleChatMessage } from "../modules/chat/chat.controller.ts";
import { WsConnectionStore } from "../store/connection.store.ts";
import { WsRoomStore } from "../store/rooms.store.ts";
import type { AuthUser } from "../types/auth.types.ts";

export function handleCloseConnection(ws: WebSocket) {
  // then perform further operations on it.
  // remove ws from all rooms
  WsRoomStore.removeSocketFromAllRooms(ws); // first cuz we want to get all the rooms

  // remove connections
  WsConnectionStore.removeConnection(ws); // second : deleting entire ws related data

  console.log("WS connection closed");
}

export function handleConnection(
  ws: WebSocket,
  req: any,
  wss: WebSocketServer,
) {
  console.log("New WS connection");
  console.log("Number of ws clients connected", wss.clients.size);

  try {
    // this is not correct blocker for ws request to connect // TODO : fix this
    const { id: userId } = req.user as AuthUser;

    // managing ws connections - custom logic
    WsConnectionStore.registerConnection(ws, userId);

    ws.on("message", (data) => {
      handleChatMessage(ws, data);
    });

    ws.on("close", handleCloseConnection);
  } catch (e: any) {
    handleCloseConnection(ws);
    console.error("Error in WS connection", e.message);
  }
}
