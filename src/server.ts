import express from "express";
import { createServer } from "http";
import { initWebSocket } from "./websocket/index.ts";
import routes from "./routes/index.ts";

const app = express();

app.use(routes);

const httpServer = createServer(app);

initWebSocket({ server: httpServer });

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`Server + WebSocket running on http://localhost:${PORT}`);
});
