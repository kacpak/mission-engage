import { setupWorker } from "msw/browser";
import { ws } from "msw";
import { WHITEBOARD_WEBSOCKET_URL } from "../../consts";
import type { WhiteBoardStateMessage } from "../../useWhiteboardState";

const whiteboard = ws.link(WHITEBOARD_WEBSOCKET_URL);

export const worker = setupWorker(
  whiteboard.addEventListener("connection", ({ client }) => {
    console.log("[WS server] connected to client");

    client.addEventListener("message", (event) => {
      console.log("[WS server] received:", event.data);
    });

    client.send("Hello from server");
  }),
);
await worker.start();

export const sendMessageToClients = (state: WhiteBoardStateMessage) => whiteboard.broadcast(JSON.stringify(state));

declare global {
  interface Window {
    sendMessageToClients: typeof sendMessageToClients;
  }
}

window.sendMessageToClients = sendMessageToClients;
