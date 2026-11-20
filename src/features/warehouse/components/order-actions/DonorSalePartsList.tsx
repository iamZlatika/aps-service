import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { DonorSaleFormValues } from "@/features/warehouse/lib/orderActions.schema.ts";
import type { DonorSalePartRow } from "@/features/warehouse/lib/service.ts";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import { stripNonDigits } from "@/shared/lib/utils.ts";

interface DonorSalePartsListProps {
  parts: DonorSalePartRow[];
}

const onDigitsInput = (e: { currentTarget: HTMLInputElement }) => {
  e.currentTarget.value = stripNonDigits(e.currentTarget.value);
};

/**
 * Tick the parts that go with the donor and fix their cost price right here —
 * a typed cost price is saved on the part card.
 */
export const DonorSalePartsList = ({ parts }: DonorSalePartsListProps) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<DonorSaleFormValues>();

  return (
    <ul className="flex flex-col gap-2">
      {parts.map((part, index) => (
        <li key={part.id} className="flex items-start gap-3">
          <Controller
            name={`parts.${index}.selected`}
            control={control}
            render={({ field }) => (
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 pt-2 text-sm">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
                <span className="truncate">{part.label}</span>
              </label>
            )}
          />
          <div className="w-32 shrink-0">
            <FormField
              autoComplete="off"
              inputMode="numeric"
              placeholder={t("warehouse.donorSale.costPrice")}
              aria-label={t("warehouse.donorSale.costPrice")}
              onInput={onDigitsInput}
              error={errors.parts?.[index]?.costPrice}
              {...register(`parts.${index}.costPrice`)}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};
