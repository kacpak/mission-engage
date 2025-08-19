export const WHITEBOARD_WEBSOCKET_URL = localStorage.getItem("WS_URL") ?? "ws://localhost:8123";
export const TOKEN_NUMBER = 5;

export const TANGIBLES = ["astronaut", "alien", "form-flow", "signature", "approval", "data-processing"] as const;

export const FIELDS = ["flow-1", "flow-2", "flow-3", "flow-4", "help"] as const;

export const IS_MOCK = localStorage.getItem("MOCK") === "true";
