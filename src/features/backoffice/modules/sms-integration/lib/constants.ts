import { type SmsMessageStatus } from "@/shared/types.ts";

export const SMS_STATUS_COLORS: Record<SmsMessageStatus, string> = {
  pending: "gray",
  sent: "sky",
  delivered: "green",
  read: "blue",
  rejected: "red",
  undelivered: "red",
  expired: "orange",
  failed: "red",
  unknown: "gray",
};
