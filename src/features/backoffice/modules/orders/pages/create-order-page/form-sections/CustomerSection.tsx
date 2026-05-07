import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import SearchableSelect from "@/features/backoffice/modules/orders/components/searchable-select";
import { CustomerOption } from "@/features/backoffice/modules/orders/components/searchable-select/CustomerOption.tsx";
import type { SearchableSelectOption } from "@/features/backoffice/modules/orders/components/searchable-select/searchableSelect.types.ts";
import type { NewOrderSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import type {
  CustomerByNameMeta,
  CustomerByPhoneMeta,
} from "@/features/backoffice/modules/orders/lib/searchFetchers.ts";
import { PhoneMaskInput } from "@/features/backoffice/widgets/table/components/inputs/PhoneMaskInput.tsx";
import { CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

type CustomerSectionProps = {
  fetchCustomersByName: (
    search: string,
  ) => Promise<SearchableSelectOption<CustomerByNameMeta>[]>;
  fetchCustomersByPhone: (
    search: string,
  ) => Promise<SearchableSelectOption<CustomerByPhoneMeta>[]>;
};

export const CustomerSection = ({
  fetchCustomersByName,
  fetchCustomersByPhone,
}: CustomerSectionProps) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<NewOrderSchema>();
  const [isSecondaryPhoneLocked, setIsSecondaryPhoneLocked] = useState(false);

  return (
    <div className="lg:col-start-1 lg:row-start-1 flex flex-col gap-4">
      <CardTitle className="text-2xl font-bold my-3">
        {t("orders.customerInfo")}
      </CardTitle>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.customerName")}</Label>
        <Controller
          name="customerName"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              placeholder={t("orders.placeholders.customerName")}
              value={field.value ?? ""}
              onChange={field.onChange}
              onSelect={(option) => {
                setValue("customerPrimaryPhone", option.meta.phone);
                const secondaryPhone = option.meta.phones[1];
                setValue("customerSecondaryPhone", secondaryPhone ?? "");
                setIsSecondaryPhoneLocked(!!secondaryPhone);
              }}
              onClear={() => {
                setValue("customerPrimaryPhone", "");
                setValue("customerSecondaryPhone", "");
                setIsSecondaryPhoneLocked(false);
              }}
              renderOption={(option) => (
                <CustomerOption
                  name={option.name}
                  phones={option.meta.phones}
                />
              )}
              fetchItems={fetchCustomersByName}
              queryKey={["customers", "search-by-name"]}
              error={errors.customerName}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">
          {t("orders.form.customerPrimaryPhone")}
        </Label>
        <Controller
          name="customerPrimaryPhone"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              value={field.value ?? ""}
              onChange={field.onChange}
              onSelect={(option) => {
                setValue("customerName", option.meta.customerName);
                const secondaryPhone = option.meta.phones[1];
                setValue("customerSecondaryPhone", secondaryPhone ?? "");
                setIsSecondaryPhoneLocked(!!secondaryPhone);
              }}
              renderOption={(option) => (
                <CustomerOption
                  name={option.meta.customerName}
                  phones={option.meta.phones}
                />
              )}
              renderInput={(props) => (
                <PhoneMaskInput
                  value={props.value}
                  onChange={props.onChange}
                  onFocus={props.onFocus}
                  onBlur={props.onBlur}
                  onKeyDown={props.onKeyDown}
                  hasError={props.hasError}
                />
              )}
              fetchItems={fetchCustomersByPhone}
              queryKey={["customers", "search-by-phone"]}
              error={errors.customerPrimaryPhone}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">
          {t("orders.form.customerSecondaryPhone")}
        </Label>
        <Controller
          control={control}
          name="customerSecondaryPhone"
          render={({ field: { onChange, value } }) => (
            <PhoneMaskInput
              value={value ?? ""}
              onChange={onChange}
              disabled={isSecondaryPhoneLocked}
              hasError={!!errors.customerSecondaryPhone}
            />
          )}
        />
        {errors.customerSecondaryPhone && (
          <p className="text-sm text-destructive">
            {errors.customerSecondaryPhone.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-base">
          {t("customers.register_form.email")}
        </Label>
        <Input
          type="email"
          placeholder={t("orders.placeholders.customerEmail")}
          className="h-11 text-base md:text-base"
          {...register("customerEmail")}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.comment")}</Label>
        <Input
          placeholder={t("orders.placeholders.customerComment")}
          className="h-11 text-base md:text-base"
          {...register("customerComment")}
        />
      </div>
    </div>
  );
};
