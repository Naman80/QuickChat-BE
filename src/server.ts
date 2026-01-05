import http from "http";
import app from "./app.ts";
import { initWebSocket } from "./websocket/index.ts";

export function startServer() {
  const server = http.createServer(app);

  // initialising web socket server
  initWebSocket(server);

  server.listen(8080, () => {
    console.log("Server running on port 8080");
  });
}
