export const ROLES = {
  CLIENT: "client",
  MANAGER: "manager",
  HEAD_MANAGER: "head_manager",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const USER_STATUSES = {
  ACTIVE: "active",
  BLOCKED: "blocked",
} as const;

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

export type Language = "ru" | "uk";
