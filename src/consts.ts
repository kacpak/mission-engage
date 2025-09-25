export const DB_FILENAME = "mission-engage.db";

export const USE_CASES = [
  {
    title: "Self service",
    description:
      "A four step self-service where customers perform tasks for themselves to get services, rather than relying on employees or attendants.",
  },
  {
    title: "Account opening",
    description:
      "Users can ask to open a new account by walking through a four step process by providing information and signing their request for the bank to review.",
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

export const MAX_LIFES = 3;
