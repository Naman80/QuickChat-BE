import type { Server } from "http";
import { handleConnection } from "./ws.handler.ts";
import { WebSocketServer } from "ws";
import { authenticateWs } from "./ws.auth.ts";

export function initWebSocket({ server }: { server: Server }) {
  // create new ws server.
  const wss = new WebSocketServer({
    noServer: true,
    clientTracking: true,
    maxPayload: 128 * 1024, // 128KB
  });

  server.on("upgrade", (req, socket, head) => {
    try {
      const auth = authenticateWs(req);
      // Attach auth to req for later use
      (req as any).user = auth;

      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    } catch (err: any) {
      console.error("WebSocket upgrade error:" + err?.message);
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
    }
  });

  wss.on("connection", (ws, req) => {
    handleConnection(ws, req, wss);
  });
}
