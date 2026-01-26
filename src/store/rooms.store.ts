// concept of rooms is basically grouping all ws connections connected to a particular chat|group|channel
// that means < roomId aka chatId |  all ws connections >
import { type WebSocket } from "ws";
import { getWsConnectionData } from "./connection.store.ts";

// in memory store
const rooms: Map<string, Set<WebSocket>> = new Map();

// add user to room
export function joinRoom(roomId: string, ws: WebSocket) {
  if (!rooms.has(roomId)) {
    // TODO: throw new Error("Room does not exist");
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId)!.add(ws);
}

export function leaveRoom(roomId: string, ws: WebSocket) {
  rooms.get(roomId)?.delete(ws);
  if (rooms.get(roomId)?.size === 0) {
    rooms.delete(roomId);
  }
}

export function getRoomClients(roomId: string) {
  return rooms.get(roomId) || new Set();
}

// when socket connection closes
export function removeClientFromRooms(ws: WebSocket) {
  // get all the rooms ws|user is part of
  // remove ws from all those rooms

  const WsConnectionData = getWsConnectionData(ws);

  const allRooms = WsConnectionData?.rooms;

  console.log(allRooms, "all rooms ws has joined");

  allRooms?.forEach((roomId) => {
    const allSocketSet = rooms.get(roomId);
    if (allSocketSet) {
      allSocketSet.delete(ws);
    }
  });
}
