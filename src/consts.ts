import type { ReactNode } from "react";

export const DB_FILENAME = "file:mission-engage.db";

export const USE_CASES = [
  {
    title: "Self service",
    description:
      "A 4 step self-service where customers perform tasks for themselves to get services, rather than relying on employees or attendants.",
  },
  {
    title: "Account opening",
    description:
      "Users can ask to open a new account by walking through a 4 step process by providing information and signing their request for the bank to review.",
  },

  {
    title: "Accept terms & conditions",
    description:
      "A workflow that sends an automatically initiated request to obtain consent for updated terms and conditions.",
  },
] as const;
export type UseCaseTitle = (typeof USE_CASES)[number]["title"];

export const TANGIBLES = ["astronaut", "alien", "form-flow", "signature", "approval", "data-processing"] as const;
export type WorkflowTangible = Exclude<(typeof TANGIBLES)[number], "alien" | "astronaut">;

export const WINNING_ORDERS: Record<UseCaseTitle, WorkflowTangible[]> = {
  "Accept terms & conditions": ["data-processing", "form-flow", "signature", "data-processing"],
  "Account opening": ["form-flow", "signature", "approval", "data-processing"],
  "Self service": ["form-flow", "signature", "approval", "data-processing"],
};

export const TANGIBLES_HELP_TEXT: Record<WorkflowTangible, ReactNode> = {
  approval:
    "The Accept step allows users to either approve or decline the content or putput of a specific step in the workflow.",
  signature:
    "The signature step enables users to accept or reject the content or output of a step by providing a signature to it.",
  "form-flow": "This form step enables users to fill out forms to collect structured input.",
  "data-processing":
    "The data processing step either sends data to an external system and waits for a response or receives it.",
};

export const MAX_LIFES = 3;
