import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { Customer } from "@/features/backoffice/modules/customers/types.ts";
import { issueTypesApi } from "@/features/backoffice/modules/dictionaries/api";
import { AddButton } from "@/features/backoffice/modules/dictionaries/components/AddButton.tsx";
import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { newOrderSchema } from "@/features/backoffice/modules/orders/lib/schema.ts";
import {
  type NewOrder,
  type Order,
} from "@/features/backoffice/modules/orders/types.ts";
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

const OrdersPage = () => {
  const { t } = useTranslation();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: issueTypesData } = useQuery({
    queryKey: queryKeys.dictionaries.issueTypes(1, 999),
    queryFn: () => issueTypesApi.getAll(1, 999),
  });

  const issueTypeOptions =
    issueTypesData?.items.map((item) => ({
      value: item.name as string,
      label: item.name as string,
    })) ?? [];

  const addOrderMutation = useMutation({
    mutationFn: (data: NewOrder) => ordersApi.addNewOrder(data),
    onSuccess: () => {
      setIsAddOpen(false);
      return queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all,
      });
    },
  });

  const handleAddOrderSubmit = useCallback(
    async (
      values: Partial<BaseItem>,
      setError: UseFormSetError<Record<string, string>>,
    ) => {
      try {
        await addOrderMutation.mutateAsync(values as unknown as NewOrder);
      } catch (error) {
        handleFormError(error, setError);
      }
    },
    [addOrderMutation],
  );

  const columns: ColumnConfig<Order>[] = [
    {
      key: "customer",
      labelKey: "customers.table_fields.name",
      sortable: true,
      renderCell: (value) => {
        const customer = value as Customer;
        return <span>{customer.name}</span>;
      },
    },
    {
      key: "status",
      labelKey: "customers.table_fields.lastOrderAt",
      sortable: true,
    },
    {
      key: "customer",
      labelKey: "customers.table_fields.mainPhone",
      sortable: false,
      renderCell: (value) => {
        const customer = value as Customer;
        const mainPhone = customer.phones.find((phone) => phone.isPrimary);
        return <span>{mainPhone?.phoneNumber}</span>;
      },
    },
  ];

  const registerFields: FieldConfig[] = [
    {
      key: "customerName",
      label: t("customers.register_form.name"),
      placeholder: t("customers.register_form.name_placeholder"),
      required: true,
    },

    {
      key: "customerPhone",
      label: t("customers.register_form.phone"),
      placeholder: t("customers.register_form.phone_placeholder"),
      required: true,
      type: "phone",
    },
    {
      key: "issueType",
      label: t("dictionaries.table_fields.category"),
      required: true,
      type: "select",
      options: issueTypeOptions,
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
        titleKey="breadcrumbs.orders"
        api={ordersApi}
        queryKeyFn={queryKeys.orders.list}
        searchPlaceholder="search_placeholders.customer_phone"
        searchField="phone_number"
        searchNumbersOnly
        columns={columns}
        headerActions={<AddButton onClick={() => setIsAddOpen(true)} />}
        // onRowClick={onRowClick}
      />
      <ItemFormDialog
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        title={t("customers.register_form.title")}
        fields={registerFields}
        schema={newOrderSchema}
        cancelLabel={t("customers.register_form.cancel")}
        confirmLabel={t("customers.register_form.submit")}
        onConfirm={handleAddOrderSubmit}
        isPending={addOrderMutation.isPending}
      />
    </>
  );
};

export default OrdersPage;
