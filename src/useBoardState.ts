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
  const { lastJsonMessage } = useWebSocket<WhiteBoardStateMessage>(WHITEBOARD_WEBSOCKET_URL, {
    share: true,
    reconnectAttempts: Infinity,
    reconnectInterval: (attemptNumber) => Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
    filter: (message) => {
      try {
        const messageAsObject = JSON.parse(message.data as string);
        return !!v.parse(WhiteboardStateMessageSchema, messageAsObject);
      } catch {
        return false;
      }
    },
  });

  return lastJsonMessage?.payload ?? null;
};

export const useSendToBoard = () => {
  const { sendMessage } = useWebSocket<WhiteBoardStateMessage>(WHITEBOARD_WEBSOCKET_URL, {
    share: true,
    reconnectAttempts: Infinity,
    reconnectInterval: (attemptNumber) => Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
  });
  return sendMessage;
};
