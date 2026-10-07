import { z } from "zod";

import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";
import { BANK_TRANSACTION_SOURCES } from "@/shared/types.ts";

export const BankTransactionDtoSchema = z.object({
  id: z.number(),
  amount: z.string(),
  currency_code: z.number(),
  description: z.string().nullable(),
  comment: z.string().nullable(),
  counter_name: z.string().nullable(),
  counter_iban: z.string().nullable(),
  occurred_at: z.iso.datetime(),
  source: zodEnumFromConst(BANK_TRANSACTION_SOURCES),
  created_at: z.iso.datetime(),
});
export type BankTransactionDto = z.infer<typeof BankTransactionDtoSchema>;

const BankTransactionsPaginationMetaDtoSchema = z.object({
  current_page: z.number(),
  per_page: z.number(),
  total: z.number(),
  last_page: z.number(),
});

export const PaginatedBankTransactionsDtoSchema = z.object({
  data: z.array(BankTransactionDtoSchema),
  meta: BankTransactionsPaginationMetaDtoSchema,
});
export type PaginatedBankTransactionsDto = z.infer<
  typeof PaginatedBankTransactionsDtoSchema
>;
