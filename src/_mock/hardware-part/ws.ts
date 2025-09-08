import { setupWorker } from "msw/browser";
import { ws } from "msw";
import type { WhiteBoardStateMessage } from "../../useBoardState.ts";
import { WHITEBOARD_WEBSOCKET_URL } from "../../consts.client.ts";

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
await worker.start({
  serviceWorker: {
    url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
  },
});

export const sendMessageToClients = (state: WhiteBoardStateMessage) => whiteboard.broadcast(JSON.stringify(state));

declare global {
  interface Window {
    sendMessageToClients: typeof sendMessageToClients;
  }
}

window.sendMessageToClients = sendMessageToClients;
