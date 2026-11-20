import { FormProvider, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { InvestmentItemField } from "@/features/warehouse/components/donor-investment/InvestmentItemField.tsx";
import { useAddDonorInvestment } from "@/features/warehouse/hooks/useDonorInvestments.ts";
import {
  INVESTMENT_MODES,
  type InvestmentMode,
} from "@/features/warehouse/lib/investment.schema.ts";
import { FormField } from "@/shared/components/common/FormField.tsx";
import SegmentedControl from "@/shared/components/SegmentedControl.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { stripNonDigits } from "@/shared/lib/utils.ts";

interface DonorInvestmentDialogProps {
  donorId: number;
  onClose: () => void;
}

const onDigitsInput = (e: { currentTarget: HTMLInputElement }) => {
  e.currentTarget.value = stripNonDigits(e.currentTarget.value);
};

/** Mount only while open — the form takes its defaults on mount. */
export const DonorInvestmentDialog = ({
  donorId,
  onClose,
}: DonorInvestmentDialogProps) => {
  const { t } = useTranslation();
  const { methods, onSubmit, isPending } = useAddDonorInvestment({
    donorId,
    onSuccess: onClose,
  });
  const {
    control,
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = methods;
  const mode = useWatch({ control, name: "mode" });
  const isWarehouse = mode === INVESTMENT_MODES.WAREHOUSE;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("warehouse.investments.add")}</DialogTitle>
        </DialogHeader>
        <SegmentedControl<InvestmentMode>
          value={mode}
          options={[
            {
              value: INVESTMENT_MODES.WAREHOUSE,
              label: t("warehouse.investments.fromWarehouse"),
            },
            {
              value: INVESTMENT_MODES.FREE,
              label: t("warehouse.investments.freeLine"),
            },
          ]}
          onChange={(next) => {
            setValue("mode", next);
            clearErrors();
          }}
        />
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {isWarehouse ? (
              <>
                <InvestmentItemField />
                <div className="flex flex-col gap-1">
                  <Label>{t("warehouse.investments.quantity")}</Label>
                  <FormField
                    autoComplete="off"
                    inputMode="numeric"
                    onInput={onDigitsInput}
                    error={errors.quantity}
                    {...register("quantity")}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1">
                <Label>{t("warehouse.investments.name")}</Label>
                <FormField
                  autoComplete="off"
                  maxLength={255}
                  placeholder={t("warehouse.investments.namePlaceholder")}
                  error={errors.name}
                  {...register("name")}
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Label>{t("warehouse.investments.amount")}</Label>
              <FormField
                autoComplete="off"
                inputMode="numeric"
                placeholder={
                  isWarehouse
                    ? t("warehouse.investments.amountAutoHint")
                    : undefined
                }
                onInput={onDigitsInput}
                error={errors.amount}
                {...register("amount")}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>{t("warehouse.investments.note")}</Label>
              <FormField
                autoComplete="off"
                maxLength={500}
                error={errors.note}
                {...register("note")}
              />
            </div>
            {errors.root && (
              <p className="text-sm text-destructive">{errors.root.message}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {t("common.add")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
