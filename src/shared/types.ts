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

export const USER_LANGUAGES = {
  UK: "uk",
  RU: "ru",
} as const;

export type UserLanguage = (typeof USER_LANGUAGES)[keyof typeof USER_LANGUAGES];

export const USER_THEMES = {
  DARK: "dark",
  LIGHT: "light",
} as const;

export type UserTheme = (typeof USER_THEMES)[keyof typeof USER_THEMES];

export interface SuccessResponse {
  message: string;
}

export const STATUS_COLORS = {
  Red: "red",
  Fuchsia: "fuchsia",
  Pink: "pink",
  Violet: "violet",
  Blue: "blue",
  Sky: "sky",
  Green: "green",
  Yellow: "yellow",
  Orange: "orange",
  Black: "black",
  Gray: "gray",
} as const;
