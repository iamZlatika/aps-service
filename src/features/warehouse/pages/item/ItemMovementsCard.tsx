import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import {
  InfoTable,
  type InfoTableColumn,
} from "@/features/orders/components/info-table/InfoTable.tsx";
import { ORDERS_LINKS } from "@/features/orders/navigation.ts";
import { QUICK_ORDERS_LINKS } from "@/features/quick-orders/navigation.ts";
import type { StockMovement } from "@/features/warehouse/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";
import { cn, formatDate } from "@/shared/lib/utils.ts";

interface ItemMovementsCardProps {
  movements: StockMovement[];
}

export const ItemMovementsCard = ({ movements }: ItemMovementsCardProps) => {
  const { t } = useTranslation();

  const renderSource = (row: StockMovement) => {
    if (row.orderId !== null) {
      return (
        <Link
          to={ORDERS_LINKS.detail(row.orderId)}
          className="text-primary hover:underline"
        >
          {t("warehouse.stock.order", { id: row.orderId })}
        </Link>
      );
    }
    if (row.quickOrderId !== null) {
      return (
        <Link
          to={QUICK_ORDERS_LINKS.detail(row.quickOrderId)}
          className="text-primary hover:underline"
        >
          {t("warehouse.stock.quickOrder", { id: row.quickOrderId })}
        </Link>
      );
    }
    return row.note ?? "—";
  };

  const columns: InfoTableColumn<StockMovement>[] = [
    {
      key: "createdAt",
      label: t("orders.finance.table.date"),
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: "location",
      label: t("warehouse.table.location"),
      render: (row) => row.location?.name ?? "—",
    },
    {
      key: "reason",
      label: t("warehouse.table.status"),
      render: (row) => t(`warehouse.reasons.${row.reason}`),
    },
    {
      key: "delta",
      label: t("warehouse.table.quantity"),
      render: (row) => (
        <span
          className={cn(
            "tabular-nums font-medium",
            row.delta > 0 ? "text-green-500" : "text-destructive",
          )}
        >
          {row.delta > 0 ? `+${row.delta}` : row.delta}
        </span>
      ),
    },
    {
      // The price in force at that moment — shows when it changed.
      key: "purchasePrice",
      label: t("warehouse.table.purchasePrice"),
      render: (row) =>
        row.purchasePrice !== null ? (
          <MoneyAmount value={row.purchasePrice} />
        ) : (
          "—"
        ),
    },
    {
      key: "user",
      label: t("orders.orderTable.user"),
      collapsible: true,
      render: (row) => row.user?.name ?? "—",
    },
    {
      key: "note",
      label: t("warehouse.stock.note"),
      collapsible: true,
      render: renderSource,
    },
  ];

  return (
    <Card className="p-2 sm:p-6">
      <CardContent className="flex flex-col gap-4 p-0">
        <h2 className="text-lg font-semibold">
          {t("warehouse.item.movements")}
        </h2>
        {movements.length ? (
          <InfoTable columns={columns} data={movements} />
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("warehouse.item.noMovements")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
