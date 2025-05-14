import useWebSocket from "react-use-websocket";
import { TOKEN_NUMBER, WHITEBOARD_WEBSOCKET_URL } from "./consts";
import * as v from "valibot";

const WhiteboardStateMessageSchema = v.object({
  type: v.literal("whiteboard-state"),
  payload: v.array(v.union([v.string(), v.null()])),
});
type WhiteBoardStateMessage = v.InferOutput<
  typeof WhiteboardStateMessageSchema
>;

export const useWhiteboardState = () => {
  const { lastJsonMessage } = useWebSocket<WhiteBoardStateMessage>(
    WHITEBOARD_WEBSOCKET_URL,
    {
      share: true,
      reconnectAttempts: Infinity,
      reconnectInterval: (attemptNumber) =>
        Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
      filter: (message) => {
        try {
          const messageAsObject = JSON.parse(message.data as string);
          return !!v.parse(WhiteboardStateMessageSchema, messageAsObject);
        } catch {
          return false;
        }
      },
    }
  );

  return lastJsonMessage?.payload ?? Array(TOKEN_NUMBER).fill(null);
};
