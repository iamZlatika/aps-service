export const ROLES = {
  CLIENT: "client",
  USER: "user",
  HEAD_MANAGER: "head_manager",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
