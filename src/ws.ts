import { WHITEBOARD_WEBSOCKET_URL } from "./consts.ts";

const whiteBoardSocket = new WebSocket(WHITEBOARD_WEBSOCKET_URL);
whiteBoardSocket.addEventListener("open", () => {
  whiteBoardSocket.send("connected");
});
whiteBoardSocket.addEventListener("message", (event) => {
  console.log("[WS client] received", event.data);
});
