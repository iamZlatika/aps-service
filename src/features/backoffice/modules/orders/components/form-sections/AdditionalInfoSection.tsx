import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { Location } from "@/features/backoffice/modules/dictionaries/types.ts";
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
  users: User[];
  isLoadingUsers?: boolean;
  locations: Location[];
  isLoadingLocations?: boolean;
};

export const AdditionalInfoSection = ({
  users,
  isLoadingUsers,
  locations,
  isLoadingLocations,
}: AdditionalInfoSectionProps) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<NewOrderSchema>();

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
          placeholder={t("orders.placeholders.estimatedCost")}
          className="h-11 text-base md:text-base"
          inputMode="numeric"
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
          }}
          {...register("estimatedCost")}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.prepayment")}</Label>
        <Input
          placeholder={t("orders.placeholders.prepayment")}
          className="h-11 text-base md:text-base"
          inputMode="numeric"
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
          }}
          {...register("prepayment")}
        />
      </div>
    </div>
  );
};
