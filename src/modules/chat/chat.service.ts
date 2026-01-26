// controller will send message type here
import { type WebSocket } from "ws";
import {
  getWsConnectionData,
  joinConnectionRoom,
} from "../../store/connection.store.ts";
import { getRoomClients, joinRoom } from "../../store/rooms.store.ts";
import type { WSMessage } from "../../websocket/ws.types.ts";
import { WS_EVENTS } from "../../websocket/ws.events.ts";

// room handling functions

export function handleJoinRoom(ws: WebSocket, message: WSMessage) {
  const { roomId } = message.payload;
  const connection = getWsConnectionData(ws);
  console.log(connection);

  if (!connection) return;

  // this should be in transaction

  // join the room
  joinRoom(roomId, ws);

  // this handling should not be here
  joinConnectionRoom(roomId, ws);

  // you joined this room.
  ws.send(
    JSON.stringify({
      type: WS_EVENTS.USER_JOINED,
      payload: { roomId },
    }),
  );
}

export function handleSendMessage(ws: WebSocket, message: WSMessage) {
  const { roomId, text } = message.payload;

  const connection = getWsConnectionData(ws);

  if (!connection || !connection.rooms.has(roomId)) {
    ws.send(
      JSON.stringify({
        type: WS_EVENTS.ERROR,
        payload: "Not part of room",
      }),
    );
    return;
  }

  const clients = getRoomClients(roomId);

  clients.forEach((client) => {
    client.send(
      JSON.stringify({
        type: WS_EVENTS.NEW_MESSAGE,
        payload: {
          roomId,
          text,
          senderId: connection.userId,
        },
      }),
    );
  });
}
