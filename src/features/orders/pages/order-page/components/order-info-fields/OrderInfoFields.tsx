import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  Control,
  FieldError,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { DueDatePicker } from "@/features/orders/components/DueDatePicker.tsx";
import { useDictionarySection } from "@/features/orders/hooks/useDictionarySection.ts";
import type { EditOrderInfoFormValues } from "@/features/orders/lib/schema.ts";
import type { OrderInfo } from "@/features/orders/types.ts";
import {
  fetchReferralsByName,
  type ReferralPickerMeta,
} from "@/features/referrals/lib/searchFetchers.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { SEARCH_PAGE_SIZE } from "@/shared/lib/constants.ts";
import { formatDate } from "@/shared/lib/utils.ts";
import { MultiSearchableSelect } from "@/widgets/multi-searchable-select";
import SearchableSelect, {
  type SearchableSelectOption,
} from "@/widgets/searchable-select";

import { DisplayField, LabeledField } from "../field-primitives.tsx";

const REMOVE_REFERRAL_OPTION: SearchableSelectOption<ReferralPickerMeta> = {
  id: -1,
  name: "",
  meta: { commissionPercent: 0 },
};

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
  const [referralName, setReferralName] = useState(
    order.referral?.customer.name ?? "",
  );

  useEffect(() => {
    setReferralName(order.referral?.customer.name ?? "");
  }, [order, isEditing]);

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
          <DisplayField value={formatDate(order.dueDate)} copyable={false} />
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

      <LabeledField label={t("orders.form.referral")}>
        {isEditing ? (
          <Controller
            name="referralId"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                value={referralName}
                onChange={setReferralName}
                onSelect={(option) =>
                  field.onChange(
                    option.id === REMOVE_REFERRAL_OPTION.id ? null : option.id,
                  )
                }
                onClear={() => field.onChange(null)}
                renderOption={(option) =>
                  option.id === REMOVE_REFERRAL_OPTION.id ? (
                    <span className="flex items-center gap-1.5 text-destructive">
                      <X className="h-3.5 w-3.5" />
                      {t("orders.form.removeReferral")}
                    </span>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{option.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.meta.commissionPercent}%
                      </span>
                    </div>
                  )
                }
                fetchItems={fetchReferralsByName}
                queryKey={queryKeys.referrals.searchByName()}
                placeholder={t("orders.placeholders.referral")}
                error={errors.referralId}
                extraOptions={field.value ? [REMOVE_REFERRAL_OPTION] : []}
                dropUp
              />
            )}
          />
        ) : (
          <DisplayField
            value={
              order.referral
                ? `${order.referral.customer.name} (${order.referral.commissionPercent}%)`
                : null
            }
          />
        )}
      </LabeledField>
    </div>
  );
};
