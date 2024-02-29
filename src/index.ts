import crypto from "crypto";
import express from "express";
import WebSocket from "ws";
import { wrapBaileysSocket } from "./baileys";

const app = express();
app.use(express.static("public"));
const wss = new WebSocket.Server({ noServer: true });

interface WSMessageType {
  type: "qrcode" | "connected" | "success" | "error" | string;
  data?: string;
}

const wsSendMessage = (ws: WebSocket, message: WSMessageType) => {
  ws.send(JSON.stringify(message));
};

wss.on("connection", async (wsClient) => {
  const sessionId = crypto.randomUUID();

  console.log("Connected to client:", sessionId);

  (await wrapBaileysSocket())({
    sessionId,
    wsClient,
    onQR: (qr) => wsSendMessage(wsClient, { type: "qrcode", data: qr }),
    onConnected: () => wsSendMessage(wsClient, { type: "connected" }),
    onSocketBulkRequest: () => wsSendMessage(wsClient, { type: "success" }),
    onSocketDisconnect: () =>
      console.log("Disconnected from client:", sessionId),
  });
});

// Start server
const server = app.listen(3000, () => {
  console.log("Listening on port 3000");
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
