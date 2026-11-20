import { Controller, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { LocationSelectField } from "@/features/warehouse/components/LocationSelectField.tsx";
import { SaveStoragePlaceCheckbox } from "@/features/warehouse/components/SaveStoragePlaceCheckbox.tsx";
import { StoragePlaceField } from "@/features/warehouse/components/StoragePlaceField.tsx";
import { useDonorForm } from "@/features/warehouse/hooks/useDonorForm.ts";
import type { Donor, DonorDetail } from "@/features/warehouse/types.ts";
import { FormField } from "@/shared/components/common/FormField.tsx";
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

interface DonorFormDialogProps {
  donor?: Donor;
  defaultLocationId: number | null;
  onClose: () => void;
  onSaved?: (donor: DonorDetail) => void;
}

const TEXT_FIELDS = ["manufacturer", "deviceType", "deviceModel"] as const;

/** Mount only while open — the form takes its defaults on mount. */
export const DonorFormDialog = ({
  donor,
  defaultLocationId,
  onClose,
  onSaved,
}: DonorFormDialogProps) => {
  const { t } = useTranslation();
  const { methods, onSubmit, isPending } = useDonorForm({
    donor,
    defaultLocationId,
    onSuccess: (saved) => {
      onSaved?.(saved);
      onClose();
    },
  });
  const {
    control,
    register,
    formState: { errors },
  } = methods;

  const onDigitsInput = (e: { currentTarget: HTMLInputElement }) => {
    e.currentTarget.value = stripNonDigits(e.currentTarget.value);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t(donor ? "warehouse.donor.edit" : "warehouse.donor.create")}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {TEXT_FIELDS.map((name) => (
                <div key={name} className="flex flex-col gap-1">
                  <Label>{t(`warehouse.donor.fields.${name}`)}</Label>
                  <FormField
                    autoComplete="off"
                    error={errors[name]}
                    {...register(name)}
                  />
                </div>
              ))}
            </div>
            {/* "Where it came from" — a separate question from the note
                ("what's alive, what's dead"). */}
            <div className="flex flex-col gap-1">
              <Label>{t("warehouse.donor.fields.origin")}</Label>
              <FormField
                autoComplete="off"
                maxLength={255}
                placeholder={t("warehouse.donor.fields.originPlaceholder")}
                error={errors.origin}
                {...register("origin")}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>{t("warehouse.donor.fields.acquisitionCost")}</Label>
              <FormField
                inputMode="numeric"
                onInput={onDigitsInput}
                error={errors.acquisitionCost}
                {...register("acquisitionCost")}
              />
            </div>
            <Controller
              name="locationId"
              control={control}
              render={({ field }) => (
                <LocationSelectField
                  label={t("warehouse.donor.fields.location")}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.locationId?.message}
                />
              )}
            />
            <Controller
              name="storagePlace"
              control={control}
              render={({ field }) => (
                <StoragePlaceField
                  label={t("warehouse.donor.fields.storagePlace")}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.storagePlace?.message}
                />
              )}
            />
            <SaveStoragePlaceCheckbox />
            <div className="flex flex-col gap-1">
              <Label>{t("warehouse.donor.fields.note")}</Label>
              <FormField
                autoComplete="off"
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
                {t(donor ? "common.save" : "common.add")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
