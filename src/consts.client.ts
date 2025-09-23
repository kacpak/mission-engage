export const WHITEBOARD_WEBSOCKET_URL = localStorage.getItem("WS_URL") ?? "wss://192.168.0.2:8765";
export const CLIENT_WEBSOCKET_URL =
  localStorage.getItem("CLIENT_WS_URL") ?? `ws://${location.hostname}:${location.port}/client-ws`;
export const IS_MOCK = localStorage.getItem("MOCK") === "true";
