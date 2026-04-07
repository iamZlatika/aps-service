import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import SearchableSelect from "@/features/backoffice/modules/orders/components/searchable-select";
import { CustomerOption } from "@/features/backoffice/modules/orders/components/searchable-select/CustomerOption.tsx";
import type { SearchableSelectOption } from "@/features/backoffice/modules/orders/components/searchable-select/searchableSelect.types.ts";
import { useCreateOrder } from "@/features/backoffice/modules/orders/hooks/useCreateOrder.ts";
import {
  type NewOrderSchema,
  newOrderSchema,
} from "@/features/backoffice/modules/orders/lib/schema.ts";
import { PhoneMaskInput } from "@/features/backoffice/widgets/table/components/inputs/PhoneMaskInput.tsx";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

const PAGE_SIZE = 30;

const CreateOrderPage = () => {
  const { t } = useTranslation();

  const [managerName, setManagerName] = useState("");
  const [assigneeName, setAssigneeName] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    register,
    formState: { errors },
  } = useForm<NewOrderSchema>({
    resolver: zodResolver(newOrderSchema),
  });

  const {
    onSubmit,
    isPending,
    fetchCustomersByName,
    fetchCustomersByPhone,
    fetchUsersByName,
    fetchByDictionaryName,
    dictionaryApis,
  } = useCreateOrder(setError);

  return (
    <div className="p-2 sm:p-6 max-w-3xl mx-auto w-full">
      <h1 className="mb-6 text-2xl font-bold">{t("orders.createNew")}</h1>
      <Card className="p-2 sm:p-6">
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <CardTitle className="text-2xl font-bold my-3">
              {t("orders.customerInfo")}
            </CardTitle>

            <div className="flex flex-col gap-1">
              <Label>{t("customers.register_form.name")}</Label>
              <Controller
                name="customerName"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onSelect={(option: SearchableSelectOption) =>
                      setValue("customerPhone", option.meta?.phone as string)
                    }
                    renderOption={(option) => (
                      <CustomerOption
                        name={option.name}
                        phones={option.meta?.phones as string[]}
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
              <Label>{t("customers.register_form.phone")}</Label>
              <Controller
                name="customerPhone"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onSelect={(option: SearchableSelectOption) =>
                      setValue(
                        "customerName",
                        option.meta?.customerName as string,
                      )
                    }
                    renderOption={(option) => (
                      <CustomerOption
                        name={option.meta?.customerName as string}
                        phones={option.meta?.phones as string[]}
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
                    error={errors.customerPhone}
                  />
                )}
              />
            </div>

            <CardTitle className="text-2xl font-bold my-3">
              {t("orders.deviceInfo")}
            </CardTitle>

            <div className="flex flex-col gap-1">
              <Label>{t("breadcrumbs.issueTypes")}</Label>
              <Controller
                name="issueType"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    fetchItems={fetchByDictionaryName(
                      dictionaryApis.issueTypes,
                    )}
                    queryKey={queryKeys.dictionaries.issueTypes(1, PAGE_SIZE)}
                    error={errors.issueType}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>{t("breadcrumbs.deviceTypes")}</Label>
              <Controller
                name="deviceType"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    fetchItems={fetchByDictionaryName(
                      dictionaryApis.deviceTypes,
                    )}
                    queryKey={queryKeys.dictionaries.deviceTypes(1, PAGE_SIZE)}
                    error={errors.deviceType}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>{t("breadcrumbs.manufacturers")}</Label>
              <Controller
                name="manufacturer"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    fetchItems={fetchByDictionaryName(
                      dictionaryApis.manufacturers,
                    )}
                    queryKey={queryKeys.dictionaries.manufacturers(
                      1,
                      PAGE_SIZE,
                    )}
                    error={errors.manufacturer}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>{t("breadcrumbs.deviceModels")}</Label>
              <Controller
                name="deviceModel"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    fetchItems={fetchByDictionaryName(
                      dictionaryApis.deviceModels,
                    )}
                    queryKey={queryKeys.dictionaries.deviceModels(1, PAGE_SIZE)}
                    error={errors.deviceModel}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>{t("breadcrumbs.deviceConditions")}</Label>
              <Controller
                name="deviceCondition"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    fetchItems={fetchByDictionaryName(
                      dictionaryApis.deviceConditions,
                    )}
                    queryKey={queryKeys.dictionaries.deviceConditions(
                      1,
                      PAGE_SIZE,
                    )}
                    error={errors.deviceCondition}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>{t("breadcrumbs.accessories")}</Label>
              <Controller
                name="accessory"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    fetchItems={fetchByDictionaryName(
                      dictionaryApis.accessories,
                    )}
                    queryKey={queryKeys.dictionaries.accessories(1, PAGE_SIZE)}
                    error={errors.accessory}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>{t("breadcrumbs.intakeNotes")}</Label>
              <Controller
                name="intakeNote"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    fetchItems={fetchByDictionaryName(
                      dictionaryApis.intakeNotes,
                    )}
                    queryKey={queryKeys.dictionaries.intakeNotes(1, PAGE_SIZE)}
                    error={errors.intakeNote}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>{t("users.roles.manager")}</Label>
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
              <Label>{t("breadcrumbs.users")}</Label>
              <SearchableSelect
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
              <Label>{t("orders.form.devicePassword")}</Label>
              <Input {...register("devicePassword")} />
              {errors.devicePassword && (
                <p className="text-sm text-destructive">
                  {errors.devicePassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label>{t("orders.form.estimatedCost")}</Label>
              <Input {...register("estimatedCost")} />
            </div>

            <div className="flex flex-col gap-1">
              <Label>{t("customers.register_form.comment")}</Label>
              <Input {...register("customerComment")} />
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
              <Label htmlFor="isUrgent">{t("orders.form.isUrgent")}</Label>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {t("orders.actions.create")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOrderPage;
