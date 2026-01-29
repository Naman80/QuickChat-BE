import type { WebSocket } from "ws";

// socket -> userId
const socketToUser = new Map<WebSocket, string>();

// userId -> sockets
const userToSockets = new Map<string, Set<WebSocket>>();

export const WsConnectionStore = {
  registerConnection(ws: WebSocket, userId: string) {
    socketToUser.set(ws, userId);

    if (!userToSockets.has(userId)) {
      userToSockets.set(userId, new Set());
    }
    userToSockets.get(userId)!.add(ws);
  },

  removeConnection(ws: WebSocket) {
    const userId = socketToUser.get(ws);
    if (!userId) return;

    socketToUser.delete(ws);

    const sockets = userToSockets.get(userId);
    if (!sockets) return;

    sockets.delete(ws);
    if (sockets.size === 0) {
      userToSockets.delete(userId);
    }
  },

  getUserId(ws: WebSocket): string | undefined {
    return socketToUser.get(ws);
  },

  getSocketsByUserId(userId: string): Set<WebSocket> {
    return userToSockets.get(userId) ?? new Set();
  },
};
