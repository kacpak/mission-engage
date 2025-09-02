export const WHITEBOARD_WEBSOCKET_URL = localStorage.getItem("WS_URL") ?? "ws://localhost:8123";

export const IS_MOCK = localStorage.getItem("MOCK") === "true";

export const USE_CASES = ["Self service", "Account opening", "Accept terms and conditions"] as const;

export const TANGIBLES = ["astronaut", "alien", "form-flow", "signature", "approval", "data-processing"] as const;

export const WINNING_ORDERS: Record<(typeof USE_CASES)[number], (typeof TANGIBLES)[number][]> = {
  "Accept terms and conditions": ["data-processing", "form-flow", "signature", "data-processing"],
  "Account opening": ["form-flow", "signature", "approval", "data-processing"],
  "Self service": ["form-flow", "signature", "approval", "data-processing"],
};

export const MAX_LIFES = 3;
