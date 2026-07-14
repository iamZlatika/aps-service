import { type SmsMessageStatus, type StatusColor } from "@/shared/types.ts";

export const SMS_STATUS_COLORS: Record<SmsMessageStatus, StatusColor> = {
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
