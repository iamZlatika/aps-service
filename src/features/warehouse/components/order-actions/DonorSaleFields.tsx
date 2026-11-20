import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { DonorSalePartsList } from "@/features/warehouse/components/order-actions/DonorSalePartsList.tsx";
import { DonorSearchField } from "@/features/warehouse/components/order-actions/DonorSearchField.tsx";
import { useDonorSalePicker } from "@/features/warehouse/hooks/useDonorSalePicker.ts";
import type { DonorSaleFormValues } from "@/features/warehouse/lib/orderActions.schema.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

/** Donor, its parts and the resulting purchase — inside a FormProvider. */
export const DonorSaleFields = () => {
  const { t } = useTranslation();
  const {
    formState: { errors },
  } = useFormContext<DonorSaleFormValues>();
  const {
    donorLabel,
    parts,
    purchase,
    isLoadingDonor,
    selectDonor,
    typeDonor,
  } = useDonorSalePicker();
  const hasPicked = parts.some((part) => part.selected);

  return (
    <>
      <DonorSearchField
        label={t("warehouse.orderActions.donor")}
        value={donorLabel}
        onType={typeDonor}
        onSelect={selectDonor}
        error={errors.donorId?.message}
      />
      {isLoadingDonor && (
        <p className="text-sm text-muted-foreground">{t("loader.default")}</p>
      )}
      {purchase !== null && (
        <div className="flex flex-col gap-2">
          <Label>{t("warehouse.donorSale.parts")}</Label>
          {parts.length ? (
            <>
              <DonorSalePartsList parts={parts} />
              <p className="text-xs text-muted-foreground">
                {t("warehouse.donorSale.partsHint")}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("warehouse.donorSale.noParts")}
            </p>
          )}
          <p className="text-sm">
            {t("warehouse.donorSale.purchase")}:{" "}
            <MoneyAmount value={purchase} />{" "}
            <span className="text-muted-foreground">
              (
              {t(
                hasPicked
                  ? "warehouse.donorSale.purchaseParts"
                  : "warehouse.donorSale.purchaseWhole",
              )}
              )
            </span>
          </p>
        </div>
      )}
    </>
  );
};
