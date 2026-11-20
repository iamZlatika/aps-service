import { Controller, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { LocationSelectField } from "@/features/warehouse/components/LocationSelectField.tsx";
import { useStockMovementForm } from "@/features/warehouse/hooks/useStockMovementForm.ts";
import {
  MANUAL_STOCK_REASONS,
  type ManualStockReason,
} from "@/features/warehouse/types.ts";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { stripNonDigits } from "@/shared/lib/utils.ts";

type StockOffice = { id: number; name: string };

interface StockMovementDialogProps {
  itemId: number;
  reason: ManualStockReason;
  /** Purchase / write-off: the office of the clicked stock row (not asked). */
  office: StockOffice | null;
  /** Correction: the office is picked in the form, this is the default. */
  defaultLocationId: number | null;
  /** The item's current purchase price — prefills the field. */
  purchasePrice: string | null;
  onClose: () => void;
}

export const StockMovementDialog = ({
  itemId,
  reason,
  office,
  defaultLocationId,
  purchasePrice,
  onClose,
}: StockMovementDialogProps) => {
  const { t } = useTranslation();
  const { methods, onSubmit, isPending } = useStockMovementForm({
    itemId,
    reason,
    defaultLocationId: office?.id ?? defaultLocationId,
    purchasePrice,
    onSuccess: onClose,
  });
  const {
    control,
    register,
    formState: { errors },
  } = methods;
  const isCorrection = reason === MANUAL_STOCK_REASONS.CORRECTION;

  const onDigitsInput = (e: { currentTarget: HTMLInputElement }) => {
    e.currentTarget.value = stripNonDigits(e.currentTarget.value);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(`warehouse.stock.${reason}`)}</DialogTitle>
          <DialogDescription>
            {office && `${t("warehouse.stock.location")}: ${office.name}. `}
            {t("warehouse.stock.irreversible")}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {!office && (
              <Controller
                name="locationId"
                control={control}
                render={({ field }) => (
                  <LocationSelectField
                    label={t("warehouse.stock.location")}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.locationId?.message}
                  />
                )}
              />
            )}
            <div className="flex flex-col gap-1">
              <Label>{t("warehouse.stock.quantity")}</Label>
              <FormField
                autoComplete="off"
                inputMode={isCorrection ? "text" : "numeric"}
                error={errors.quantity}
                {...register("quantity")}
              />
              {isCorrection && (
                <p className="text-xs text-muted-foreground">
                  {t("warehouse.stock.correctionHint")}
                </p>
              )}
            </div>
            {/* One purchase price per item, no batches: a new value
                overwrites it for every office and the whole stock. */}
            <div className="flex flex-col gap-1">
              <Label>{t("warehouse.stock.purchasePrice")}</Label>
              <FormField
                autoComplete="off"
                inputMode="numeric"
                onInput={onDigitsInput}
                error={errors.purchasePrice}
                {...register("purchasePrice")}
              />
              <p className="text-xs text-muted-foreground">
                {t("warehouse.stock.purchasePriceHint")}
              </p>
            </div>
            {/* Optional for purchase / write-off, required for correction. */}
            <div className="flex flex-col gap-1">
              <Label>
                {t("warehouse.stock.note")}
                {isCorrection && " *"}
              </Label>
              <FormField
                autoComplete="off"
                maxLength={500}
                placeholder={t(`warehouse.stock.notePlaceholders.${reason}`)}
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
                {t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
