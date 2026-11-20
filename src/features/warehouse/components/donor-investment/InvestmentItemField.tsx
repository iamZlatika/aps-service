import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { DonorInvestmentFormValues } from "@/features/warehouse/lib/investment.schema.ts";
import {
  fetchWarehouseItemOptions,
  type WarehouseItemOptionMeta,
} from "@/features/warehouse/lib/searchFetchers.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import SearchableSelect, {
  type SearchableSelectOption,
} from "@/widgets/searchable-select";

/** A showcase / supply item whose stock goes into the donor. */
export const InvestmentItemField = () => {
  const { t } = useTranslation();
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<DonorInvestmentFormValues>();
  const itemLabel = useWatch({ control, name: "itemLabel" });

  const renderOption = (
    option: SearchableSelectOption<WarehouseItemOptionMeta>,
  ) => (
    <span className="flex w-full items-center justify-between gap-2">
      <span className="truncate">{option.name}</span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {t(`warehouse.kinds.${option.meta.kind}`)}
        {option.meta.purchasePrice !== null && (
          <>
            {" · "}
            <MoneyAmount value={option.meta.purchasePrice} />
          </>
        )}
      </span>
    </span>
  );

  return (
    <div className="flex flex-col gap-1">
      <Label>{t("warehouse.investments.item")}</Label>
      <SearchableSelect<WarehouseItemOptionMeta>
        value={itemLabel}
        // Typing drops the previous choice until an option is picked again.
        onChange={(text) => {
          setValue("itemLabel", text);
          setValue("itemId", null);
        }}
        onSelect={(option) => {
          setValue("itemLabel", option.name);
          setValue("itemId", option.id, { shouldValidate: true });
        }}
        fetchItems={fetchWarehouseItemOptions}
        queryKey={queryKeys.warehouse.itemOptions()}
        renderOption={renderOption}
        // SearchableSelect renders the message itself (red border + text).
        error={
          errors.itemId?.message
            ? { type: "validate", message: errors.itemId.message }
            : undefined
        }
      />
      <p className="text-xs text-muted-foreground">
        {t("warehouse.investments.stockHint")}
      </p>
    </div>
  );
};
