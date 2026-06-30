export const ROLES = {
  MANAGER: "manager",
  HEAD_MANAGER: "head_manager",
  RECEPTIONIST: "receptionist",
  ACCOUNTANT: "accountant",
  SUPPORT: "support",
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
  SYSTEM: "system",
} as const;

export type UserTheme = (typeof USER_THEMES)[keyof typeof USER_THEMES];

export type SuccessResponse = {
  message: string;
};

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

export const PAYMENTS = {
  PREPAYMENT: "prepayment",
  PAYMENT: "payment",
  REFUND: "refund",
} as const;

export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
} as const;

export const TRANSACTION_STATUSES = {
  COMPLETED: "completed",
  PENDING: "pending",
} as const;

export type TransactionStatus =
  (typeof TRANSACTION_STATUSES)[keyof typeof TRANSACTION_STATUSES];

export type PaymentType = (typeof PAYMENTS)[keyof typeof PAYMENTS];
export type PaymentMethodType =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

export const DOCUMENTS_TYPES = ["intake_receipt", "closing_receipt"] as const;
export type DocumentType = (typeof DOCUMENTS_TYPES)[number];

export const WEEK_DAYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];
