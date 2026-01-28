import express from "express";
import { createServer } from "http";
import routes from "./routes/index.ts";
import { initWebSocket } from "./websocket/index.ts";

const app = express();

app.use(routes);

const httpServer = createServer(app);

// this will handle all the upgrade requests
httpServer.on("upgrade", (req, socket, head) => {
  console.log(req.url);

  console.log("connection upgrade req");

  // we can destroy the connection here only if person is not authenticated.
  // socket.destroy();
});

initWebSocket({ server: httpServer });

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`Server + WebSocket running on http://localhost:${PORT}`);
});
