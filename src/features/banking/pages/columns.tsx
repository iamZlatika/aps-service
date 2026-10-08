import { BankTransactionDateCell } from "@/features/banking/components/BankTransactionDateCell.tsx";
import { type BankTransaction } from "@/features/banking/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { BANK_TRANSACTION_SOURCES } from "@/shared/types.ts";
import { type ColumnConfig } from "@/widgets/table/models/types.ts";

const renderText = (value: unknown) => (
  <span className="block max-w-[35ch] whitespace-normal">
    {(value as string | null) ?? "—"}
  </span>
);

export function buildBankTransactionColumns(): ColumnConfig<BankTransaction>[] {
  return [
    {
      key: "occurredAt",
      field: "occurredAt",
      labelKey: "banking.transactions.table.date",
      sortable: true,
      sortKey: "occurred_at",
      renderCell: (value, transaction) => (
        <BankTransactionDateCell
          occurredAt={value as string}
          isLate={transaction.source === BANK_TRANSACTION_SOURCES.SYNC}
        />
      ),
    },
    {
      key: "amount",
      field: "amount",
      labelKey: "banking.transactions.table.amount",
      sortable: true,
      renderCell: (value) => <MoneyAmount value={value as string} />,
    },
    {
      key: "description",
      field: "description",
      labelKey: "banking.transactions.table.description",
      sortable: false,
      renderCell: renderText,
    },
    {
      key: "comment",
      field: "comment",
      labelKey: "banking.transactions.table.comment",
      sortable: false,
      renderCell: renderText,
    },
  ];
}
