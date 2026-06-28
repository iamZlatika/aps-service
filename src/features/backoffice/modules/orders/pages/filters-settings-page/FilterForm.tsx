import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ManagerSelect } from "@/features/backoffice/modules/orders/components/ManagerSelect.tsx";
import { useFilterFormOptions } from "@/features/backoffice/modules/orders/hooks/useFilterFormOptions.ts";
import {
  type FilterPresetFormValues,
  filterPresetSchema,
} from "@/features/backoffice/modules/orders/lib/filterPresetSchema.ts";
import { LocationCheckboxGroup } from "@/shared/components/common/LocationCheckboxGroup.tsx";
import { StatusBadge } from "@/shared/components/common/StatusBadge.tsx";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Separator } from "@/shared/components/ui/separator.tsx";
import { useLocalizedName } from "@/shared/hooks/useLocalizedName.ts";
import { cn } from "@/shared/lib/utils.ts";

interface FilterFormProps {
  id?: string;
  onSubmit: (data: FilterPresetFormValues) => void;
}

export const FilterForm = ({ id, onSubmit }: FilterFormProps) => {
  const { t } = useTranslation();
  const getLocalizedName = useLocalizedName();
  const { statuses, locations, users, isLoadingUsers } = useFilterFormOptions();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FilterPresetFormValues>({
    resolver: zodResolver(filterPresetSchema),
    defaultValues: {
      name: "",
      any_match: null,
      status_ids: [],
      location_id: null,
      manager_id: null,
      is_urgent: null,
    },
  });

  return (
    <form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">
          {t("orders.filterSettings.nameLabel")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("orders.filterSettings.nameHint")}
        </p>
        <Input
          {...register("name")}
          autoComplete="off"
          className="h-11 text-base md:text-base"
          placeholder={t("orders.filterSettings.namePlaceholder")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">
            {t("orders.filterSettings.nameRequired")}
          </p>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">
          {t("orders.filterSettings.statusesLabel")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("orders.filterSettings.statusesHint")}
        </p>
        <Controller
          name="status_ids"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => {
                const isSelected = field.value.includes(status.id);
                return (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => {
                      const next = isSelected
                        ? field.value.filter((id) => id !== status.id)
                        : [...field.value, status.id];
                      field.onChange(next);
                    }}
                    className={cn(
                      "rounded-full transition-opacity",
                      !isSelected && "opacity-40 hover:opacity-70",
                    )}
                  >
                    <StatusBadge
                      name={getLocalizedName({
                        nameRu: status.name_ru,
                        nameUa: status.name_ua,
                      })}
                      color={status.color}
                    />
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">
          {t("orders.filterSettings.locationLabel")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("orders.filterSettings.locationHint")}
        </p>
        <Controller
          name="location_id"
          control={control}
          render={({ field }) => (
            <LocationCheckboxGroup
              locations={locations}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">
          {t("orders.filterSettings.urgentLabel")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("orders.filterSettings.urgentHint")}
        </p>
        <Controller
          name="is_urgent"
          control={control}
          render={({ field }) => (
            <label className="flex cursor-pointer items-center gap-2 w-fit">
              <Checkbox
                checked={field.value === 1}
                onCheckedChange={(checked) =>
                  field.onChange(checked ? 1 : null)
                }
                className="h-5 w-5"
              />
              <span className="text-base">
                {t("orders.filterSettings.urgentCheckbox")}
              </span>
            </label>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">
          {t("orders.filterSettings.managerLabel")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("orders.filterSettings.managerHint")}
        </p>
        <Controller
          name="manager_id"
          control={control}
          render={({ field }) => (
            <ManagerSelect
              value={field.value}
              onChange={(id) => field.onChange(id ?? null)}
              users={users}
              isLoading={isLoadingUsers}
              clearable
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">
          {t("orders.filterSettings.anyMatchLabel")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("orders.filterSettings.anyMatchHint")}
        </p>
        <Input
          {...register("any_match", { setValueAs: (v) => v || null })}
          autoComplete="off"
          className="h-11 text-base md:text-base"
          placeholder={t("orders.filterSettings.anyMatchPlaceholder")}
        />
      </div>
    </form>
  );
};
