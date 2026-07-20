import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import {
  InfoTable,
  type InfoTableColumn,
} from "@/features/backoffice/modules/orders/components/info-table/InfoTable.tsx";
import type { OrderTransaction } from "@/features/backoffice/modules/orders/types.ts";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";
import { TRANSACTION_STATUSES } from "@/shared/types.ts";

interface FinanceTabProps {
  transactions: OrderTransaction[];
  totalIncome: string;
}

export const FinanceTab = ({ transactions, totalIncome }: FinanceTabProps) => {
  const { t } = useTranslation();

  const pending = transactions.filter(
    (tx) => tx.status === TRANSACTION_STATUSES.PENDING,
  );
  const completed = transactions.filter(
    (tx) => tx.status === TRANSACTION_STATUSES.COMPLETED,
  );

  const columns: InfoTableColumn<OrderTransaction>[] = [
    {
      key: "createdAt",
      label: t("orders.finance.table.date"),
      render: (row) => format(new Date(row.createdAt), "dd.MM.yyyy"),
    },
    {
      key: "user",
      label: t("orders.finance.table.user"),
      render: (row) => row.referral?.customer.name ?? row.user?.name ?? "—",
    },
    {
      key: "label",
      label: t("orders.finance.table.label"),
    },
    {
      key: "amount",
      label: t("orders.finance.table.amount"),
      render: (row) => `${row.amount} ₴`,
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-6">
      <p className="text-muted-foreground text-lg font-semibold text-right">
        {t("orders.finance.totalIncome")}:{" "}
        <span className="text-foreground">{totalIncome} ₴</span>
      </p>
      <Card className="p-2 sm:p-6">
        <CardContent className="p-0 flex flex-col gap-3">
          <h3 className="font-semibold">{t("orders.finance.pending")}</h3>
          <InfoTable columns={columns} data={pending} />
        </CardContent>
      </Card>
      <Card className="p-2 sm:p-6">
        <CardContent className="p-0 flex flex-col gap-3">
          <h3 className="font-semibold">{t("orders.finance.completed")}</h3>
          <InfoTable columns={columns} data={completed} />
        </CardContent>
      </Card>
    </div>
  );
};
