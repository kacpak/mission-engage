import useWebSocket from "react-use-websocket";
import * as v from "valibot";
import { CLIENT_WEBSOCKET_URL } from "./consts.client.ts";
import { queryClient } from "./main.tsx";

const ClientWsSchema = v.object({
  type: v.literal("refresh-highscores"),
});

export const useRefreshHighscores = () => {
  useWebSocket(CLIENT_WEBSOCKET_URL, {
    share: true,
    shouldReconnect: () => true,
    reconnectAttempts: Infinity,
    reconnectInterval: 10000,
    onMessage: () => {
      queryClient.invalidateQueries({ queryKey: ["highscores"] });
    },
    filter: (message) => {
      try {
        const messageAsObject = JSON.parse(message.data as string);
        return !!v.parse(ClientWsSchema, messageAsObject);
      } catch {
        return false;
      }
    },
    skipAssert: true,
  });
};
