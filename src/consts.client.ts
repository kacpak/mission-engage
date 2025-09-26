import type { ReactNode } from "react";
import type { UseCaseTitle, WorkflowTangible } from "./consts.ts";

export const WHITEBOARD_WEBSOCKET_URL = localStorage.getItem("WS_URL") ?? "wss://192.168.0.2:8765";
export const IS_MOCK = localStorage.getItem("MOCK") === "true";

export const tangibleName: Record<WorkflowTangible, string> = {
  approval: "Accept",
  signature: "Signature",
  "form-flow": "Form",
  "data-processing": "Data processing",
};

export const TANGIBLES_HELP_TEXT: Record<UseCaseTitle, Record<WorkflowTangible, ReactNode>> = {
  "Accept terms & conditions": {
    approval: "A checkpoint where the bank can review submitted information before it becomes final.",
    signature: "Clients sign digitally to confirm acceptance. This legally binds the client to the updated terms.",
    "form-flow": "Clients review the updated Terms & Conditions and select or confirm applicable sections.",
    "data-processing":
      "Handles everything in the background: it ensures all clients get the update and later records their confirmations in the bank’s systems.",
  },
  "Account opening": {
    approval:
      "The bank verifies all details for accuracy and compliance. Approved applications proceed to account creation.",
    signature: "The client confirms the application with a secure digital signature, making the request legally valid.",
    "form-flow":
      "Collect all details for opening a new account, including business information and supporting documents.",
    "data-processing":
      "After approval, the new account is automatically added to the bank’s systems, ensuring immediate availability.",
  },
  "Self service": {
    approval: "Let the bank review the submitted information. Certain changes may require manual approval.",
    signature: "The client confirms the change digitally. A Qualified Electronic Signature authorises the request.",
    "form-flow": "Use this to collect all client information for the requested change (name, address, legal form).",
    "data-processing": "The system automatically updates all relevant bank systems.",
  },
};
