import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { Location } from "@/features/backoffice/modules/dictionaries/types.ts";
import SearchableSelect from "@/features/backoffice/modules/orders/components/searchable-select";
import type { SearchableSelectOption } from "@/features/backoffice/modules/orders/components/searchable-select/searchableSelect.types.ts";
import type { NewOrderSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import { CardTitle } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

type AdditionalInfoSectionProps = {
  fetchUsersByName: (search: string) => Promise<SearchableSelectOption[]>;
  defaultManager?: User;
  locations: Location[];
  isLoadingLocations?: boolean;
  users: User[];
  isLoadingUsers?: boolean;
};
export const AdditionalInfoSection = ({
  fetchUsersByName,
  defaultManager,
  locations,
  isLoadingLocations,
  users,
  isLoadingUsers,
}: AdditionalInfoSectionProps) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<NewOrderSchema>();

  const [assigneeName, setAssigneeName] = useState("");

  const currentManagerId = watch("managerId");
  const currentLocationId = watch("locationId");

  // Установка менеджера
  useEffect(() => {
    if (
      !isLoadingUsers &&
      users.length > 0 &&
      defaultManager &&
      !currentManagerId
    ) {
      const hasUser = users.some((u) => u.id === defaultManager.id);
      if (hasUser) {
        setValue("managerId", defaultManager.id);
      }
    }
  }, [isLoadingUsers, users, defaultManager, currentManagerId, setValue]);

  // Установка локации
  useEffect(() => {
    const userLocationId = defaultManager?.location?.id;
    const isReady =
      !isLoadingLocations &&
      locations.length > 0 &&
      !!userLocationId &&
      !currentLocationId;

    if (isReady) {
      const hasLocation = locations.some((loc) => loc.id === userLocationId);
      if (hasLocation) {
        setValue("locationId", userLocationId);
      }
    }
  }, [
    isLoadingLocations,
    locations,
    defaultManager?.location?.id,
    setValue,
    currentLocationId,
  ]);

  return (
    <div className="lg:col-start-1 lg:row-start-2 flex flex-col gap-4">
      <CardTitle className="text-2xl font-bold mb-3 mt-5">
        {t("orders.additionalInfo")}
      </CardTitle>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.manager")}</Label>
        <Controller
          name="managerId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ""}
              onValueChange={(val) =>
                field.onChange(val ? Number(val) : undefined)
              }
              disabled={!users.length || isLoadingUsers}
            >
              <SelectTrigger className="h-11 text-base">
                <SelectValue
                  placeholder={isLoadingUsers ? t("loader.default") : "..."}
                />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.location")}</Label>
        <Controller
          name="locationId"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 py-2">
              {isLoadingLocations ? (
                <span className="text-sm text-muted-foreground">
                  {t("loader.default")}
                </span>
              ) : (
                locations.map((loc) => (
                  <div key={loc.id} className="flex items-center gap-1.5">
                    <Checkbox
                      id={`loc-${loc.id}`}
                      checked={field.value === loc.id}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? loc.id : undefined)
                      }
                    />
                    <label
                      htmlFor={`loc-${loc.id}`}
                      className="cursor-pointer text-sm"
                    >
                      {loc.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          )}
        />
        {errors.locationId && (
          <p className="text-sm text-destructive">
            {errors.locationId.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.assignee")}</Label>
        <SearchableSelect
          placeholder={t("orders.placeholders.assignee")}
          value={assigneeName}
          onChange={setAssigneeName}
          onSelect={(option) => {
            setAssigneeName(option.name);
            setValue("assigneeId", option.id);
          }}
          fetchItems={fetchUsersByName}
          queryKey={["users", "search-assignee"]}
          error={errors.assigneeId}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.estimatedCost")}</Label>
        <Input
          placeholder={t("orders.placeholders.estimatedCost")}
          className="h-11 text-base md:text-base"
          {...register("estimatedCost")}
        />
      </div>

      <div className="flex items-center gap-2">
        <Controller
          name="isUrgent"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="isUrgent"
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label className="text-base" htmlFor="isUrgent">
          {t("orders.form.isUrgent")}
        </Label>
      </div>
    </div>
  );
};
