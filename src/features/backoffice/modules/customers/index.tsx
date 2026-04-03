import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { CustomerCardDialog } from "@/features/backoffice/modules/customers/components/CustomerCardDialog.tsx";
import { newCustomerSchema } from "@/features/backoffice/modules/customers/lib/newCustomerSchema.ts";
import {
  type Customer,
  type NewCustomer,
  type Phones,
} from "@/features/backoffice/modules/customers/types.ts";
import { AddButton } from "@/features/backoffice/modules/dictionaries/components/AddButton.tsx";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { ItemFormDialog } from "@/features/backoffice/widgets/table/components/dialogs";
import type {
  BaseItem,
  ColumnConfig,
  FieldConfig,
} from "@/features/backoffice/widgets/table/models/types.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

import { customersApi } from "./api";

const CustomersPage = () => {
  const { t } = useTranslation();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const columns: ColumnConfig<BaseItem>[] = [
    { key: "name", labelKey: "customers.table_fields.name", sortable: true },
    {
      key: "lastOrderAt",
      labelKey: "customers.table_fields.lastOrderAt",
      sortable: true,
    },
    {
      key: "phones",
      labelKey: "customers.table_fields.mainPhone",
      sortable: false,
      renderCell: (value) => {
        const phones = value as Phones[];
        const mainPhone = phones.find((phone) => phone.isPrimary);
        return <span>{mainPhone?.phoneNumber}</span>;
      },
    },
    {
      key: "phones",
      labelKey: "customers.table_fields.secondaryPhone",
      sortable: false,
      renderCell: (value) => {
        const phones = value as Phones[];
        const mainPhone = phones.filter((phone) => !phone.isPrimary);
        return (
          <ul className="flex flex-col gap-1">
            {mainPhone.map((phone) => (
              <li key={phone.id}>{phone.phoneNumber}</li>
            ))}
          </ul>
        );
      },
    },
  ];
  const addCustomerMutation = useMutation({
    mutationFn: (data: NewCustomer) => customersApi.addNewCustomer(data),
    onSuccess: () => {
      setIsAddOpen(false);
      return queryClient.invalidateQueries({
        queryKey: queryKeys.customers.all,
      });
    },
  });

  const handleAddCustomerSubmit = useCallback(
    async (
      values: Partial<BaseItem>,
      setError: UseFormSetError<Record<string, string>>,
    ) => {
      try {
        await addCustomerMutation.mutateAsync(values as unknown as NewCustomer);
      } catch (error) {
        handleFormError(error, setError);
      }
    },
    [addCustomerMutation],
  );

  const registerFields: FieldConfig[] = [
    {
      key: "name",
      label: t("customers.register_form.name"),
      placeholder: t("customers.register_form.name_placeholder"),
      required: true,
    },
    {
      key: "phone",
      label: t("customers.register_form.phone"),
      placeholder: t("customers.register_form.phone_placeholder"),
      required: true,
      type: "phone",
    },
    {
      key: "email",
      label: t("customers.register_form.email"),
      placeholder: t("customers.register_form.email_placeholder"),
      required: true,
      inputType: "email",
    },

    {
      key: "comment",
      label: t("customers.register_form.comment"),
      placeholder: t("customers.register_form.comment_placeholder"),
      required: true,
    },
  ];
  return (
    <>
      <SmartTable
        titleKey="breadcrumbs.customers"
        api={customersApi}
        queryKeyFn={queryKeys.customers.list}
        searchPlaceholder="search_placeholders.customer_phone"
        searchField="phone_number"
        searchNumbersOnly
        columns={columns}
        headerActions={<AddButton onClick={() => setIsAddOpen(true)} />}
        onRowClick={(item) => setSelectedCustomer(item as Customer)}
      />
      <CustomerCardDialog
        customer={selectedCustomer}
        onOpenChange={(open) => !open && setSelectedCustomer(null)}
      />
      <ItemFormDialog
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        title={t("customers.register_form.title")}
        fields={registerFields}
        schema={newCustomerSchema}
        cancelLabel={t("customers.register_form.cancel")}
        confirmLabel={t("customers.register_form.submit")}
        onConfirm={handleAddCustomerSubmit}
        isPending={addCustomerMutation.isPending}
      />
    </>
  );
};

export default CustomersPage;
