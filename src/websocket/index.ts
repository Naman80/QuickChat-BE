import type { Server } from "http";
import { handleConnection } from "./ws.handler.ts";
import { WebSocketServer } from "ws";

export function initWebSocket({ server }: { server: Server }) {
  // create new ws server.
  const wss = new WebSocketServer({
    server,
    clientTracking: true,
    maxPayload: 128 * 1024, // 128KB
  });

  wss.on("connection", (ws, req) => {
    handleConnection(ws, req, wss);
  });
}
