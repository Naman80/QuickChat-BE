import type { Server } from "http";
import { handleConnection } from "./ws.handler.ts";
import { WebSocketServer } from "ws";

export function initWebSocket({ server }: { server: Server }) {
  // create new ws server.
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    console.log("inside ws connection");

    handleConnection(ws, req, wss);
  });
}
