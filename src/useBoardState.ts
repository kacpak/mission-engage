import useWebSocket from "react-use-websocket";
import * as v from "valibot";
import { WHITEBOARD_WEBSOCKET_URL } from "./consts.client.ts";

const tangibleOrNull = v.nullable(v.string());

const WhiteboardStateSchema = v.object({
  s1: tangibleOrNull,
  s2: tangibleOrNull,
  s3: tangibleOrNull,
  s4: tangibleOrNull,
  s5: tangibleOrNull,
});

const WhiteboardStateMessageSchema = v.object({
  type: v.literal("whiteboard-state"),
  payload: WhiteboardStateSchema,
});
export type WhiteBoardStateMessage = v.InferOutput<typeof WhiteboardStateMessageSchema>;

export const useBoardState = () => {
  const { lastJsonMessage, sendMessage } = useWebSocket<WhiteBoardStateMessage>(WHITEBOARD_WEBSOCKET_URL, {
    share: true,
    shouldReconnect: () =>  true,
    reconnectAttempts: Infinity,
    reconnectInterval: 10000,
    onClose: (event) => {
      console.warn('WebSocket geschlossen:', event);
    },
    onError: (event) => {
      console.error('WebSocket Fehler:', event);
    },
    filter: (message) => {
      try {
        const messageAsObject = JSON.parse(message.data as string);
        return !!v.parse(WhiteboardStateMessageSchema, messageAsObject);
      } catch {
        return false;
      }
    },
    skipAssert: true,
  });

  return { boardState: lastJsonMessage?.payload ?? null, sendMessage };
};
