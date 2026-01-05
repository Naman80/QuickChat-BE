import { WebSocketServer, WebSocket } from "ws";

export function broadcast(
  wss: WebSocketServer,
  message: string,
  except?: WebSocket
) {
  wss.clients.forEach((client) => {
    if (client !== except && client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}
