import { useId } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useStoragePlaces } from "@/features/warehouse/hooks/useStoragePlaces.ts";
import { canSaveStoragePlace } from "@/features/warehouse/lib/service.ts";
import type { StoragePlaceInput } from "@/features/warehouse/types.ts";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import { cn } from "@/shared/lib/utils.ts";

/** The slice of the donor / part forms this checkbox reads and writes. */
type StoragePlaceFormFields = StoragePlaceInput & { locationId?: number };

/**
 * Under the storage place combobox of the donor / part forms (must sit inside
 * their FormProvider). Typed text stays on the card unless this is checked.
 */
export const SaveStoragePlaceCheckbox = () => {
  const { t } = useTranslation();
  const id = useId();
  const places = useStoragePlaces();
  const { control } = useFormContext<StoragePlaceFormFields>();
  const [storagePlace, locationId] = useWatch({
    control,
    name: ["storagePlace", "locationId"],
  });
  const isEnabled = canSaveStoragePlace(
    places,
    storagePlace,
    locationId ?? null,
  );

  return (
    <Controller
      name="saveStoragePlace"
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Checkbox
              id={id}
              checked={isEnabled && field.value}
              disabled={!isEnabled}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <label
              htmlFor={id}
              className={cn(
                "cursor-pointer text-sm",
                !isEnabled && "cursor-not-allowed text-muted-foreground",
              )}
            >
              {t("warehouse.storagePlaces.saveToDictionary")}
            </label>
          </div>
          {isEnabled && !field.value && (
            <p className="text-xs text-muted-foreground">
              {t("warehouse.storagePlaces.saveToDictionaryHint")}
            </p>
          )}
        </div>
      )}
    />
  );
};
