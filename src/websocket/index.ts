import { handleConnection } from "./ws.handler.ts";
import { WebSocketServer } from "ws";

export function initWebSocket(server: any) {
  // create new ws server.
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    handleConnection(ws, req, wss);
  });
}
