import { useTranslation } from "react-i18next";

import {
  InfoTable,
  type InfoTableColumn,
} from "@/features/orders/components/info-table/InfoTable.tsx";
import { useDeleteDonorInvestment } from "@/features/warehouse/hooks/useDonorInvestments.ts";
import type { DonorInvestment } from "@/features/warehouse/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";
import { formatDate } from "@/shared/lib/utils.ts";

interface DonorInvestmentsCardProps {
  donorId: number;
  investments: DonorInvestment[];
  canManage: boolean;
  /** Sold → the cost is fixed in the sale line; no more changes. */
  isSold: boolean;
  onAdd: () => void;
}

export const DonorInvestmentsCard = ({
  donorId,
  investments,
  canManage,
  isSold,
  onAdd,
}: DonorInvestmentsCardProps) => {
  const { t } = useTranslation();
  const { onDelete, isPending } = useDeleteDonorInvestment(donorId);
  const canChange = canManage && !isSold;

  const columns: InfoTableColumn<DonorInvestment>[] = [
    {
      key: "createdAt",
      label: t("orders.finance.table.date"),
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: "name",
      label: t("warehouse.investments.name"),
      render: (row) =>
        row.warehouseItemId !== null && row.quantity > 1
          ? `${row.name} × ${row.quantity}`
          : row.name,
    },
    {
      key: "amount",
      label: t("warehouse.investments.amount"),
      render: (row) => <MoneyAmount value={row.amount} />,
    },
    {
      key: "note",
      label: t("warehouse.investments.note"),
      collapsible: true,
      render: (row) => row.note ?? "—",
    },
  ];

  return (
    <Card className="p-2 sm:p-6">
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">
            {t("warehouse.investments.title")}
          </h2>
          {canChange && (
            <Button type="button" variant="outline" size="sm" onClick={onAdd}>
              {t("warehouse.investments.add")}
            </Button>
          )}
        </div>
        {isSold && (
          <p className="text-sm text-muted-foreground">
            {t("warehouse.investments.soldHint")}
          </p>
        )}
        {investments.length ? (
          <InfoTable
            columns={columns}
            data={investments}
            onDelete={canChange ? (row) => onDelete(row.id) : undefined}
            isDeleting={isPending}
            deleteDialogTitle={t("warehouse.investments.deleteTitle")}
            deleteDialogDescription={t(
              "warehouse.investments.deleteDescription",
            )}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("warehouse.investments.empty")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
