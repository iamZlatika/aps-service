import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { Location } from "@/features/backoffice/modules/dictionaries/types.ts";
import type {
  NewQuickOrderFormValues,
  NewQuickOrderSchema,
} from "@/features/backoffice/modules/quick-orders/lib/schema.ts";
import type { User } from "@/features/backoffice/modules/users/types.ts";
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
import { PAYMENT_METHODS } from "@/shared/types.ts";

type QuickOrderFormFieldsProps = {
  users: User[];
  isLoadingUsers?: boolean;
  locations: Location[];
  isLoadingLocations?: boolean;
};

const QuickOrderFormFields = ({
  users,
  isLoadingUsers,
  locations,
  isLoadingLocations,
}: QuickOrderFormFieldsProps) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<NewQuickOrderFormValues, unknown, NewQuickOrderSchema>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("quickOrders.form.manager")}</Label>
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
        <Label className="text-base">{t("quickOrders.form.location")}</Label>
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
                      id={`quick-order-loc-${loc.id}`}
                      checked={field.value === loc.id}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? loc.id : undefined)
                      }
                    />
                    <label
                      htmlFor={`quick-order-loc-${loc.id}`}
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
        <Label className="text-base">
          {t("quickOrders.form.paymentMethod")}
        </Label>
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <div className="flex gap-x-4 py-1">
              {Object.values(PAYMENT_METHODS).map((method) => (
                <div key={method} className="flex items-center gap-1.5">
                  <Checkbox
                    id={`quick-order-pm-${method}`}
                    checked={field.value === method}
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? method : undefined)
                    }
                  />
                  <label
                    htmlFor={`quick-order-pm-${method}`}
                    className="cursor-pointer text-sm"
                  >
                    {t(`orders.paymentMethods.${method}`)}
                  </label>
                </div>
              ))}
            </div>
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("quickOrders.form.comment")}</Label>
        <Input
          autoComplete="new-password"
          placeholder={t("quickOrders.form.commentPlaceholder")}
          className="h-11 text-base md:text-base"
          {...register("comment")}
        />
      </div>
    </div>
  );
};

export default QuickOrderFormFields;
