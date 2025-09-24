import useWebSocket from "react-use-websocket";
import * as v from "valibot";
import { WHITEBOARD_WEBSOCKET_URL } from "./consts.client.ts";
import { create } from "zustand";
import { useEffect } from "react";

const tangibleOrNull = v.nullable(v.string());

const WhiteboardStateSchema = v.object({
  s1: tangibleOrNull,
  s2: tangibleOrNull,
  s3: tangibleOrNull,
  s4: tangibleOrNull,
  s5: tangibleOrNull,
});
export type WhiteBoardState = v.InferOutput<typeof WhiteboardStateSchema>;

const WhiteboardStateMessageSchema = v.object({
  type: v.literal("whiteboard-state"),
  payload: WhiteboardStateSchema,
});
export type WhiteBoardStateMessage = v.InferOutput<typeof WhiteboardStateMessageSchema>;

const usePersistedBoardState = create<{
  boardState: WhiteBoardState;
  setBoardState: (newState: WhiteBoardState) => void;
}>((set) => ({
  boardState: { s1: null, s2: null, s3: null, s4: null, s5: null },
  setBoardState: (newBoardState) =>
    set((prev) =>
      JSON.stringify(newBoardState) === JSON.stringify(prev.boardState) ? prev : { boardState: newBoardState },
    ),
}));

export const useBoardState = () => {
  const { lastJsonMessage, sendMessage } = useWebSocket<WhiteBoardStateMessage>(WHITEBOARD_WEBSOCKET_URL, {
    share: true,
    shouldReconnect: () => true,
    reconnectAttempts: Infinity,
    reconnectInterval: 10000,
    onClose: (event) => {
      console.warn("WebSocket geschlossen:", event);
    },
    onError: (event) => {
      console.error("WebSocket Fehler:", event);
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

  const { boardState, setBoardState } = usePersistedBoardState();

  useEffect(() => {
    if (lastJsonMessage) {
      setBoardState(lastJsonMessage.payload);
    }
  }, [lastJsonMessage, setBoardState]);

  return { boardState: boardState, sendMessage };
};
