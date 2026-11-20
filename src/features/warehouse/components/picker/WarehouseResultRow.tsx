import { useTranslation } from "react-i18next";

import { WarehouseSourceBadge } from "@/features/warehouse/components/picker/WarehouseSourceBadge.tsx";
import { StockQuantity } from "@/features/warehouse/components/StockQuantity.tsx";
import {
  getDonorTitle,
  getStoragePlaceLabel,
  isDonorPartSource,
} from "@/features/warehouse/lib/service.ts";
import type { WarehouseSearchResult } from "@/features/warehouse/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";

interface WarehouseResultRowProps {
  result: WarehouseSearchResult;
}

export const WarehouseResultRow = ({ result }: WarehouseResultRowProps) => {
  const { t } = useTranslation();
  const storagePlace = getStoragePlaceLabel(result);

  return (
    <div className="flex w-full min-w-0 items-start gap-2">
      <WarehouseSourceBadge source={result.source} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{result.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {result.category.name}
          {result.donor &&
            ` · ${t("warehouse.picker.fromDonor", {
              donor:
                getDonorTitle(result.donor) ??
                t("warehouse.donor.unnamed", { id: result.donor.id }),
            })}`}
          {storagePlace && ` · ${storagePlace}`}
        </p>
      </div>
      <div className="shrink-0 text-right text-sm">
        {result.price !== null && <MoneyAmount value={result.price} />}
        {!isDonorPartSource(result) && (
          <p className="text-xs text-muted-foreground">
            {t("warehouse.picker.inStock")}:{" "}
            <StockQuantity quantity={result.quantity} />
          </p>
        )}
      </div>
    </div>
  );
};
