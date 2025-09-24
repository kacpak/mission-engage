import type { ReactNode } from "react";
import type { UseCaseTitle, WorkflowTangible } from "./consts.ts";

export const WHITEBOARD_WEBSOCKET_URL = localStorage.getItem("WS_URL") ?? "wss://192.168.0.2:8765";
export const IS_MOCK = localStorage.getItem("MOCK") === "true";

export const TANGIBLES_HELP_TEXT: Record<UseCaseTitle, Record<WorkflowTangible, ReactNode>> = {
  "Accept terms & conditions": {
    approval:
      "The Accept step allows users to either approve or decline the content or output of a specific step in the workflow.",
    signature:
      "The signature step enables users to accept or reject the content or output of a step by providing a signature to it.",
    "form-flow": "This form step enables users to fill out forms to collect structured input.",
    "data-processing":
      "The data processing step either sends data to an external system and waits for a response or receives it.",
  },
  "Account opening": {
    approval:
      "The Accept step allows users to either approve or decline the content or output of a specific step in the workflow.",
    signature:
      "The signature step enables users to accept or reject the content or output of a step by providing a signature to it.",
    "form-flow": "This form step enables users to fill out forms to collect structured input.",
    "data-processing":
      "The data processing step either sends data to an external system and waits for a response or receives it.",
  },
  "Self service": {
    approval:
      "The Accept step allows users to either approve or decline the content or output of a specific step in the workflow.",
    signature:
      "The signature step enables users to accept or reject the content or output of a step by providing a signature to it.",
    "form-flow": "This form step enables users to fill out forms to collect structured input.",
    "data-processing":
      "The data processing step either sends data to an external system and waits for a response or receives it.",
  },
};
