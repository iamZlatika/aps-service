import { Controller, type FieldError, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { DueDatePicker } from "@/features/backoffice/modules/orders/components/DueDatePicker.tsx";
import { MultiSearchableSelect } from "@/features/backoffice/modules/orders/components/multsearchable-select";
import SearchableSelect from "@/features/backoffice/modules/orders/components/searchable-select";
import { useDictionarySection } from "@/features/backoffice/modules/orders/hooks/useDictionarySection.ts";
import type { NewOrderSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { CardTitle } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import {
  ACCESSORY_QUICK_SELECT,
  SEARCH_PAGE_SIZE,
} from "@/shared/lib/constants.ts";

export const DeviceSection = () => {
  const { fetchers, createItemFns } = useDictionarySection();
  const { t } = useTranslation();
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<NewOrderSchema>();

  return (
    <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 flex flex-col gap-4">
      <CardTitle className="text-2xl font-bold my-3">
        {t("orders.deviceInfo")}
      </CardTitle>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.issueType")}</Label>
        <Controller
          name="issueType"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              placeholder={t("orders.placeholders.issueTypes")}
              value={field.value ?? ""}
              onChange={field.onChange}
              fetchItems={fetchers.issueTypes}
              queryKey={queryKeys.dictionaries.issueTypes(1, SEARCH_PAGE_SIZE)}
              error={errors.issueType}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.deviceType")}</Label>
        <Controller
          name="deviceType"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              placeholder={t("orders.placeholders.deviceType")}
              value={field.value ?? ""}
              onChange={field.onChange}
              fetchItems={fetchers.deviceTypes}
              queryKey={queryKeys.dictionaries.deviceTypes(1, SEARCH_PAGE_SIZE)}
              error={errors.deviceType}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.manufacturer")}</Label>
        <Controller
          name="manufacturer"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              placeholder={t("orders.placeholders.manufacturer")}
              value={field.value ?? ""}
              onChange={field.onChange}
              fetchItems={fetchers.manufacturers}
              queryKey={queryKeys.dictionaries.manufacturers(
                1,
                SEARCH_PAGE_SIZE,
              )}
              error={errors.manufacturer}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.deviceModel")}</Label>
        <Controller
          name="deviceModel"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              placeholder={t("orders.placeholders.deviceModel")}
              value={field.value ?? ""}
              onChange={field.onChange}
              fetchItems={fetchers.deviceModels}
              queryKey={queryKeys.dictionaries.deviceModels(
                1,
                SEARCH_PAGE_SIZE,
              )}
              error={errors.deviceModel}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.devicePassword")}</Label>
        <Input
          placeholder={t("orders.placeholders.devicePassword")}
          className="h-11 text-base md:text-base"
          {...register("devicePassword")}
        />
        {errors.devicePassword && (
          <p className="text-sm text-destructive">
            {errors.devicePassword.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.deviceCondition")}</Label>
        <Controller
          name="deviceCondition"
          control={control}
          render={({ field }) => (
            <MultiSearchableSelect
              placeholder={t("orders.placeholders.deviceCondition")}
              value={field.value ?? []}
              onChange={field.onChange}
              fetchItems={fetchers.deviceConditions}
              queryKey={queryKeys.dictionaries.deviceConditions(
                1,
                SEARCH_PAGE_SIZE,
              )}
              error={errors.deviceCondition as FieldError | undefined}
              onCreateItem={createItemFns.deviceConditions}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.accessory")}</Label>
        <Controller
          name="accessory"
          control={control}
          render={({ field }) => (
            <MultiSearchableSelect
              placeholder={t("orders.placeholders.accessory")}
              value={field.value ?? []}
              onChange={field.onChange}
              fetchItems={fetchers.accessories}
              queryKey={queryKeys.dictionaries.accessories(1, SEARCH_PAGE_SIZE)}
              error={errors.accessory as FieldError | undefined}
              onCreateItem={createItemFns.accessories}
              quickSelectLabels={[...ACCESSORY_QUICK_SELECT]}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.intakeNotes")}</Label>
        <Controller
          name="intakeNote"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              placeholder={t("orders.placeholders.intakeNotes")}
              value={field.value ?? ""}
              onChange={field.onChange}
              fetchItems={fetchers.intakeNotes}
              queryKey={queryKeys.dictionaries.intakeNotes(1, SEARCH_PAGE_SIZE)}
              error={errors.intakeNote}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.dueDate")}</Label>
        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <DueDatePicker
              value={field.value}
              onChange={field.onChange}
              placeholder={t("orders.placeholders.dueDate")}
              error={errors.dueDate}
            />
          )}
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
              onCheckedChange={(checked) => {
                field.onChange(checked);
                const date = new Date();
                date.setDate(date.getDate() + (checked ? 1 : 5));
                setValue("dueDate", date.toISOString().split("T")[0]);
              }}
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
