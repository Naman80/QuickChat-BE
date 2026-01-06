import { type WebSocket } from "ws";

interface WsConnectionMeta {
  userId: string | null;
  rooms: Set<string>;
}

const WsConnectionsData: Map<WebSocket, WsConnectionMeta> = new Map<
  WebSocket,
  WsConnectionMeta
>();

export function registerWsConnection(ws: WebSocket, userId: string) {
  const connectionDetails: WsConnectionMeta = {
    userId,
    rooms: new Set(),
  };

  WsConnectionsData.set(ws, connectionDetails);

  console.log(WsConnectionsData.size, "size");
}

export function removeWsConnection(ws: WebSocket) {
  WsConnectionsData.delete(ws);
}

export function getWsConnectionData(
  ws: WebSocket
): WsConnectionMeta | undefined {
  // if present return if not ??
  return WsConnectionsData.get(ws);
}

export function getAllWsConnectionData() {
  return WsConnectionsData;
}

export function joinConnectionRoom(roomId: string, ws: WebSocket) {
  const wsConnectionData = getWsConnectionData(ws);

  wsConnectionData?.rooms.add(roomId);
}
