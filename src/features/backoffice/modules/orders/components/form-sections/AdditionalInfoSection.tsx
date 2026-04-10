import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import SearchableSelect from "@/features/backoffice/modules/orders/components/searchable-select";
import type { SearchableSelectOption } from "@/features/backoffice/modules/orders/components/searchable-select/searchableSelect.types.ts";
import type { NewOrderSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import { CardTitle } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

type AdditionalInfoSectionProps = {
  fetchUsersByName: (search: string) => Promise<SearchableSelectOption[]>;
  defaultManager?: { id: number; name: string };
};

export const AdditionalInfoSection = ({
  fetchUsersByName,
  defaultManager,
}: AdditionalInfoSectionProps) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<NewOrderSchema>();

  const [managerName, setManagerName] = useState(defaultManager?.name ?? "");
  const [assigneeName, setAssigneeName] = useState("");

  useEffect(() => {
    if (defaultManager) {
      setManagerName(defaultManager.name);
      setValue("managerId", defaultManager.id);
    }
  }, [defaultManager, setValue]);

  return (
    <div className="lg:col-start-1 lg:row-start-2 flex flex-col gap-4">
      <CardTitle className="text-2xl font-bold mb-3 mt-5">
        {t("orders.additionalInfo")}
      </CardTitle>

      <div className="flex flex-col gap-1">
        <Label className="text-base">{t("orders.form.manager")}</Label>
        <SearchableSelect
          value={managerName}
          onChange={setManagerName}
          onSelect={(option) => {
            setManagerName(option.name);
            setValue("managerId", option.id);
          }}
          fetchItems={fetchUsersByName}
          queryKey={["users", "search-manager"]}
          error={errors.managerId}
        />
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
