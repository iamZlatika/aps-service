import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import type { Transaction } from "@/features/billing/types.ts";
import {
  InfoTable,
  type InfoTableColumn,
} from "@/features/orders/components/info-table/InfoTable.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";
import { TRANSACTION_STATUSES } from "@/shared/types.ts";

function getManagerName(row: Transaction): string {
  const itemManager = row.orderService?.manager ?? row.orderProduct?.manager;
  return itemManager?.name ?? row.user?.name ?? "—";
}

interface QuickOrderFinanceTabProps {
  totalPrice: string;
  totalCost: string;
  totalIncome: string;
  transactions: Transaction[];
}

const QuickOrderFinanceTab = ({
  totalPrice,
  totalCost,
  totalIncome,
  transactions,
}: QuickOrderFinanceTabProps) => {
  const { t } = useTranslation();

  const completed = transactions.filter(
    (tx) => tx.status === TRANSACTION_STATUSES.COMPLETED,
  );

  const columns: InfoTableColumn<Transaction>[] = [
    {
      key: "createdAt",
      label: t("orders.finance.table.date"),
      render: (row) => format(new Date(row.createdAt), "dd.MM.yyyy"),
    },
    {
      key: "manager",
      label: t("quickOrders.form.manager"),
      render: (row) => getManagerName(row),
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
      <div className="flex flex-wrap gap-x-8 gap-y-2 justify-end text-right">
        <p className="text-muted-foreground">
          {t("quickOrders.finance.totalPrice")}:{" "}
          <span className="font-medium text-foreground">{totalPrice} ₴</span>
        </p>
        <p className="text-muted-foreground">
          {t("quickOrders.finance.totalCost")}:{" "}
          <span className="font-medium text-foreground">{totalCost} ₴</span>
        </p>
        <p className="text-muted-foreground text-lg font-semibold">
          {t("quickOrders.finance.totalIncome")}:{" "}
          <span className="text-foreground">{totalIncome} ₴</span>
        </p>
      </div>
      <Card className="p-2 sm:p-6">
        <CardContent className="p-0">
          <InfoTable columns={columns} data={completed} />
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickOrderFinanceTab;
