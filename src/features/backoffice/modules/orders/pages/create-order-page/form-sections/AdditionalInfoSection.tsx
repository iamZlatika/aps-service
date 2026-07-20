import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { Location } from "@/features/backoffice/modules/dictionaries/types.ts";
import type { NewOrderSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import type { ReferralPickerMeta } from "@/features/backoffice/modules/referrals/lib/searchFetchers.ts";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
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
import { stripNonDigits } from "@/shared/lib/utils";
import { PAYMENT_METHODS } from "@/shared/types.ts";
import type { SearchableSelectOption } from "@/widgets/searchable-select";
import SearchableSelect from "@/widgets/searchable-select";

type AdditionalInfoSectionProps = {
  users: User[];
  isLoadingUsers?: boolean;
  locations: Location[];
  isLoadingLocations?: boolean;
  showReferralField?: boolean;
  fetchReferralsByName?: (
    search: string,
  ) => Promise<SearchableSelectOption<ReferralPickerMeta>[]>;
};

export const AdditionalInfoSection = ({
  users,
  isLoadingUsers,
  locations,
  isLoadingLocations,
  showReferralField,
  fetchReferralsByName,
}: AdditionalInfoSectionProps) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<NewOrderSchema>();
  const [referralName, setReferralName] = useState("");

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
        <Label className="text-base">{t("orders.form.estimatedCost")}</Label>
        <Input
          autoComplete="new-password"
          placeholder={t("orders.placeholders.estimatedCost")}
          className="h-11 text-base md:text-base"
          {...register("estimatedCost")}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.prepayment")}</Label>
        <Controller
          name="prepaymentMethod"
          control={control}
          render={({ field }) => (
            <div className="flex gap-x-4 py-1">
              {Object.values(PAYMENT_METHODS).map((method) => (
                <div key={method} className="flex items-center gap-1.5">
                  <Checkbox
                    id={`pm-${method}`}
                    checked={field.value === method}
                    onCheckedChange={(checked) => {
                      if (checked) field.onChange(method);
                    }}
                  />
                  <label
                    htmlFor={`pm-${method}`}
                    className="cursor-pointer text-sm"
                  >
                    {t(`orders.paymentMethods.${method}`)}
                  </label>
                </div>
              ))}
            </div>
          )}
        />
        <Input
          autoComplete="new-password"
          placeholder={t("orders.placeholders.prepayment")}
          className="h-11 text-base md:text-base"
          inputMode="numeric"
          onInput={(e) => {
            e.currentTarget.value = stripNonDigits(e.currentTarget.value);
          }}
          {...register("prepayment")}
        />
      </div>

      {showReferralField && fetchReferralsByName && (
        <div className="flex flex-col gap-1">
          <Label className="text-base">{t("orders.form.referral")}</Label>
          <SearchableSelect
            placeholder={t("orders.placeholders.referral")}
            value={referralName}
            onChange={setReferralName}
            onSelect={(option) => setValue("referralId", option.id)}
            onClear={() => setValue("referralId", null)}
            renderOption={(option) => (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{option.name}</span>
                <span className="text-xs text-muted-foreground">
                  {option.meta.commissionPercent}%
                </span>
              </div>
            )}
            fetchItems={fetchReferralsByName}
            queryKey={queryKeys.referrals.searchByName()}
            error={errors.referralId}
          />
        </div>
      )}
    </div>
  );
};
