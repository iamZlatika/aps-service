import type {
  Control,
  FieldError,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { DueDatePicker } from "@/features/backoffice/modules/orders/components/DueDatePicker.tsx";
import { useDictionarySection } from "@/features/backoffice/modules/orders/hooks/useDictionarySection.ts";
import type { EditOrderInfoFormValues } from "@/features/backoffice/modules/orders/lib/schema.ts";
import type { OrderInfo } from "@/features/backoffice/modules/orders/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { SEARCH_PAGE_SIZE } from "@/shared/lib/constants.ts";
import { formatDate } from "@/shared/lib/utils.ts";
import { MultiSearchableSelect } from "@/widgets/multi-searchable-select";
import SearchableSelect from "@/widgets/searchable-select";

import { DisplayField, LabeledField } from "../field-primitives.tsx";

interface EditOrderInfoFormProps {
  register: UseFormRegister<EditOrderInfoFormValues>;
  control: Control<EditOrderInfoFormValues>;
  errors: FieldErrors<EditOrderInfoFormValues>;
  order: OrderInfo;
  isEditing: boolean;
}

export const OrderInfoFields = ({
  register,
  control,
  errors,
  order,
  isEditing,
}: EditOrderInfoFormProps) => {
  const { t } = useTranslation();
  const { fetchers, createItemFns } = useDictionarySection();

  return (
    <div className="flex flex-col gap-3">
      <LabeledField label={t("orders.form.dueDate")}>
        {isEditing ? (
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <DueDatePicker
                value={field.value}
                onChange={field.onChange}
                error={errors.dueDate}
              />
            )}
          />
        ) : (
          <DisplayField value={formatDate(order.dueDate)} />
        )}
      </LabeledField>

      <LabeledField label={t("orders.form.issueType")}>
        {isEditing ? (
          <Controller
            name="issueType"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value ?? ""}
                onChange={field.onChange}
                fetchItems={fetchers.issueTypes}
                queryKey={queryKeys.dictionaries.issueTypes(
                  1,
                  SEARCH_PAGE_SIZE,
                )}
                placeholder={t("orders.placeholders.issueTypes")}
                error={errors.issueType}
                onCreateItem={createItemFns.issueTypes}
              />
            )}
          />
        ) : (
          <DisplayField value={order.issueType} />
        )}
      </LabeledField>

      <LabeledField label={t("orders.form.deviceType")}>
        {isEditing ? (
          <Controller
            name="deviceType"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value ?? ""}
                onChange={field.onChange}
                fetchItems={fetchers.deviceTypes}
                queryKey={queryKeys.dictionaries.deviceTypes(
                  1,
                  SEARCH_PAGE_SIZE,
                )}
                placeholder={t("orders.placeholders.deviceType")}
                error={errors.deviceType}
                onCreateItem={createItemFns.deviceTypes}
              />
            )}
          />
        ) : (
          <DisplayField value={order.deviceType} />
        )}
      </LabeledField>

      <LabeledField label={t("orders.form.manufacturer")}>
        {isEditing ? (
          <Controller
            name="manufacturer"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value ?? ""}
                onChange={field.onChange}
                fetchItems={fetchers.manufacturers}
                queryKey={queryKeys.dictionaries.manufacturers(
                  1,
                  SEARCH_PAGE_SIZE,
                )}
                placeholder={t("orders.placeholders.manufacturer")}
                error={errors.manufacturer}
                onCreateItem={createItemFns.manufacturers}
              />
            )}
          />
        ) : (
          <DisplayField value={order.manufacturer} />
        )}
      </LabeledField>

      <LabeledField label={t("orders.form.deviceModel")}>
        {isEditing ? (
          <Controller
            name="deviceModel"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value ?? ""}
                onChange={field.onChange}
                fetchItems={fetchers.deviceModels}
                queryKey={queryKeys.dictionaries.deviceModels(
                  1,
                  SEARCH_PAGE_SIZE,
                )}
                placeholder={t("orders.placeholders.deviceModel")}
                error={errors.deviceModel}
                onCreateItem={createItemFns.deviceModels}
              />
            )}
          />
        ) : (
          <DisplayField value={order.deviceModel} />
        )}
      </LabeledField>

      <LabeledField
        htmlFor="devicePassword"
        label={t("orders.form.devicePassword")}
      >
        {isEditing ? (
          <FormField
            id="devicePassword"
            {...register("devicePassword")}
            error={errors.devicePassword}
            className="h-11 text-base md:text-base"
            autoCapitalize="none"
            autoCorrect="off"
          />
        ) : (
          <DisplayField value={order.devicePassword} />
        )}
      </LabeledField>

      <LabeledField label={t("orders.form.deviceCondition")}>
        {isEditing ? (
          <Controller
            name="deviceCondition"
            control={control}
            render={({ field }) => (
              <MultiSearchableSelect
                value={field.value ?? []}
                onChange={field.onChange}
                fetchItems={fetchers.deviceConditions}
                queryKey={queryKeys.dictionaries.deviceConditions(
                  1,
                  SEARCH_PAGE_SIZE,
                )}
                placeholder={t("orders.placeholders.deviceCondition")}
                error={errors.deviceCondition as FieldError | undefined}
                onCreateItem={createItemFns.deviceConditions}
                dropUp
              />
            )}
          />
        ) : (
          <DisplayField value={order.deviceCondition} />
        )}
      </LabeledField>

      <LabeledField label={t("orders.form.accessory")}>
        {isEditing ? (
          <Controller
            name="accessory"
            control={control}
            render={({ field }) => (
              <MultiSearchableSelect
                value={field.value ?? []}
                onChange={field.onChange}
                fetchItems={fetchers.accessories}
                queryKey={queryKeys.dictionaries.accessories(
                  1,
                  SEARCH_PAGE_SIZE,
                )}
                placeholder={t("orders.placeholders.accessory")}
                error={errors.accessory as FieldError | undefined}
                onCreateItem={createItemFns.accessories}
                dropUp
              />
            )}
          />
        ) : (
          <DisplayField value={order.accessory} />
        )}
      </LabeledField>

      <LabeledField label={t("orders.form.intakeNotes")}>
        {isEditing ? (
          <Controller
            name="intakeNote"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={field.value ?? ""}
                onChange={field.onChange}
                fetchItems={fetchers.intakeNotes}
                queryKey={queryKeys.dictionaries.intakeNotes(
                  1,
                  SEARCH_PAGE_SIZE,
                )}
                placeholder={t("orders.placeholders.intakeNotes")}
                error={errors.intakeNote}
                onCreateItem={createItemFns.intakeNotes}
                dropUp
              />
            )}
          />
        ) : (
          <DisplayField value={order.intakeNote} />
        )}
      </LabeledField>

      <LabeledField
        htmlFor="estimatedCost"
        label={t("orders.form.estimatedCost")}
      >
        {isEditing ? (
          <FormField
            id="estimatedCost"
            placeholder={t("orders.placeholders.estimatedCost")}
            className="h-11 text-base md:text-base"
            {...register("estimatedCost")}
            error={errors.estimatedCost}
          />
        ) : (
          <DisplayField value={order.estimatedCost} />
        )}
      </LabeledField>
    </div>
  );
};
