export const ROLES = {
  CLIENT: "client",
  USER: "user",
  SUPER_ADMIN: "super_admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
