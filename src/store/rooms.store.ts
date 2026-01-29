// // concept of rooms is basically grouping all ws connections connected to a particular chat|group|channel
// // that means < roomId aka chatId |  all ws connections >
import type { WebSocket } from "ws";

// roomId -> sockets
const rooms = new Map<string, Set<WebSocket>>();

export const WsRoomStore = {
  joinRoom(roomId: string, ws: WebSocket) {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId)!.add(ws);
  },

  leaveRoom(roomId: string, ws: WebSocket) {
    const sockets = rooms.get(roomId);
    if (!sockets) return;

    sockets.delete(ws);
    if (sockets.size === 0) {
      rooms.delete(roomId);
    }
  },

  getRoomSockets(roomId: string): Set<WebSocket> {
    return rooms.get(roomId) ?? new Set();
  },

  removeSocketFromAllRooms(ws: WebSocket) {
    for (const [roomId, sockets] of rooms.entries()) {
      sockets.delete(ws);
      if (sockets.size === 0) {
        rooms.delete(roomId);
      }
    }
  },
};
