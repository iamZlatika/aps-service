import type { Customer } from "@/features/customers/types.ts";
import type { SmsMessageStatus, SmsProvider } from "@/shared/types.ts";

export type SmsBalance = {
  amount: number;
  lowBalanceThreshold: number;
  isLow: boolean;
};

export type SmsMessage = {
  id: number;
  customer: Customer | null;
  provider: SmsProvider;
  providerMessageId: string | null;
  phone: string;
  text: string;
  status: SmsMessageStatus;
  providerStatus: string | null;
  price: string | null;
  segments: number | null;
  error: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
};
