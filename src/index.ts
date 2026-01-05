// import express from "express";
// import { WebSocketServer } from "ws";

// const PORT = 8080;

// const app = express();

// app.use(express.json());

// const httpServer = app.listen(PORT, () => {
//   console.log("Server running on port", PORT);
// });

// const wsServer = new WebSocketServer({ server: httpServer });

// app.get("/test", (req, res) => {
//   res.status(200).json("test api is working, means server is up");
// });

// wsServer.on("connection", (ws, request) => {
//   console.log("this is ws connection");
//   console.log("number of clients connected", wsServer.clients.size);

//   ws.on("open", () => {
//     ws.send("hi client server this side");
//   });

//   ws.on("message", (data, isBinary) => {
//     // data is in buffer form

//     wsServer.clients.forEach((client, index) => {
//       // console.log("this client loop", client, "index", index);
//       client.send("someone connected");
//     });

//     ws.send("hi client server this side");
//     console.log("Received:", data.toString());
//   });

//   ws.on("close", () => {
//     console.log("Connection closed");
//   });
// });

import { startServer } from "./server.ts";

startServer();
