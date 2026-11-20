import { useTranslation } from "react-i18next";

import {
  InfoTable,
  type InfoTableColumn,
} from "@/features/orders/components/info-table/InfoTable.tsx";
import { SaleSummary } from "@/features/warehouse/components/SaleSummary.tsx";
import {
  getPartDisplayName,
  getStoragePlaceLabel,
} from "@/features/warehouse/lib/service.ts";
import type { DonorPart } from "@/features/warehouse/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";

interface DonorPartsCardProps {
  parts: DonorPart[];
  canManage: boolean;
  /** A sold donor takes no new parts. */
  canAdd: boolean;
  isDeleting: boolean;
  onAdd: () => void;
  onEdit: (part: DonorPart) => void;
  onDelete: (part: DonorPart) => void;
}

export const DonorPartsCard = ({
  parts,
  canManage,
  canAdd,
  isDeleting,
  onAdd,
  onEdit,
  onDelete,
}: DonorPartsCardProps) => {
  const { t } = useTranslation();

  const columns: InfoTableColumn<DonorPart>[] = [
    {
      key: "name",
      label: t("warehouse.table.name"),
      render: (part) => getPartDisplayName(part),
    },
    {
      key: "category",
      label: t("warehouse.table.category"),
      render: (part) => part.category.name,
    },
    {
      key: "costPrice",
      label: t("warehouse.table.costPrice"),
      render: (part) =>
        part.costPrice === null ? "—" : <MoneyAmount value={part.costPrice} />,
    },
    {
      // On the shelf → where it lies; sold → where it went and for how much.
      key: "status",
      label: t("warehouse.table.status"),
      collapsible: true,
      render: (part) =>
        part.isSold ? (
          <span className="flex flex-col">
            <span className="font-medium">
              {t(
                part.soldWithDonor
                  ? "warehouse.part.soldWithDonor"
                  : "warehouse.donorStatuses.sold",
              )}
            </span>
            <span className="text-xs text-muted-foreground">
              <SaleSummary sale={part} />
            </span>
          </span>
        ) : (
          (getStoragePlaceLabel(part) ?? "—")
        ),
    },
  ];

  return (
    <Card className="p-2 sm:p-6">
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">
            {t("warehouse.donor.parts")}
          </h2>
          {canManage && canAdd && (
            <Button type="button" variant="outline" size="sm" onClick={onAdd}>
              {t("warehouse.donor.addPart")}
            </Button>
          )}
        </div>
        {parts.length ? (
          <InfoTable
            columns={columns}
            data={parts}
            // A sold part is history: no editing, no deleting.
            onRowClick={
              canManage
                ? (part) => {
                    if (!part.isSold) onEdit(part);
                  }
                : undefined
            }
            onDelete={canManage ? onDelete : undefined}
            isUnchangeable={(part) => part.isSold}
            isDeleting={isDeleting}
            deleteDialogTitle={t("warehouse.part.deleteTitle")}
            deleteDialogDescription={t("warehouse.part.deleteDescription")}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("warehouse.donor.noParts")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
