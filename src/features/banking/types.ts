import type { BankTransactionDto } from "@/features/banking/api/dto.ts";
import type { BankTransactionSource } from "@/shared/types.ts";

export type BankTransaction = {
  id: number;
  amount: string;
  currencyCode: number;
  description: string | null;
  comment: string | null;
  counterName: string | null;
  counterIban: string | null;
  occurredAt: string;
  source: BankTransactionSource;
  createdAt: string;
};

export type BankTransactionReceivedSocketEvent = {
  data: { transaction: BankTransactionDto };
};
