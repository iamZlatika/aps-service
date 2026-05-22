import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ScheduleBuilder } from "@/features/backoffice/modules/dictionaries/components/ScheduleBuilder.tsx";
import { useLocationForm } from "@/features/backoffice/modules/dictionaries/hooks/useLocationForm.ts";
import { PhoneMaskInput } from "@/features/backoffice/widgets/table/components/inputs/PhoneMaskInput.tsx";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import type { Location } from "@/shared/types";

interface LocationFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  location: Location | null;
  onSuccess: () => void;
}

export const LocationFormDialog = ({
  isOpen,
  onOpenChange,
  location,
  onSuccess,
}: LocationFormDialogProps) => {
  const { t } = useTranslation();
  const { register, control, getValues, trigger, errors, isPending, onSubmit } =
    useLocationForm(location, isOpen, onSuccess);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {location
              ? t("dictionaries.locations.form.title_edit")
              : t("dictionaries.locations.form.title_create")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {t("dictionaries.locations.form.name")}
            </label>
            <FormField
              {...register("name")}
              placeholder={t("dictionaries.placeholders.name")}
              error={errors.name}
            />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                {t("dictionaries.locations.form.city_ru")}
              </label>
              <FormField {...register("city_ru")} error={errors.city_ru} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                {t("dictionaries.locations.form.city_ua")}
              </label>
              <FormField {...register("city_ua")} error={errors.city_ua} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                {t("dictionaries.locations.form.district_ru")}
              </label>
              <FormField
                {...register("district_ru")}
                error={errors.district_ru}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                {t("dictionaries.locations.form.district_ua")}
              </label>
              <FormField
                {...register("district_ua")}
                error={errors.district_ua}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                {t("dictionaries.locations.form.street_ru")}
              </label>
              <FormField {...register("street_ru")} error={errors.street_ru} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                {t("dictionaries.locations.form.street_ua")}
              </label>
              <FormField {...register("street_ua")} error={errors.street_ua} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                {t("dictionaries.locations.form.building")}
              </label>
              <FormField {...register("building")} error={errors.building} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {t("dictionaries.locations.form.phone")}
            </label>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <PhoneMaskInput
                    value={field.value}
                    onChange={field.onChange}
                    hasError={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <ScheduleBuilder
            control={control}
            errors={errors}
            getValues={getValues}
            trigger={trigger}
          />

          {errors.root && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("loader.default") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
