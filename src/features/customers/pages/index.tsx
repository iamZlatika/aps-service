import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ABILITIES } from "@/features/auth/abilities.ts";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import {
  CUSTOMERS_BOOLEAN_FILTER_KEYS,
  CustomersFilterBar,
} from "@/features/customers/components/CustomersFilterBar.tsx";
import { MergeCustomerDialog } from "@/features/customers/components/MergeCustomerDialog.tsx";
import { useAddCustomer } from "@/features/customers/hooks/useAddCustomer.ts";
import { newCustomerSchema } from "@/features/customers/lib/schemas.ts";
import { type Customer, type Phone } from "@/features/customers/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { AddButton } from "@/shared/components/AddButton";
import { MergeButton } from "@/shared/components/MergeButton";
import { SmartTable } from "@/widgets/table";
import { ItemFormDialog } from "@/widgets/table/components/dialogs";
import type {
  ColumnConfig,
  FieldConfig,
} from "@/widgets/table/models/types.ts";

import { customersApi } from "../api";
import { CUSTOMERS_LINKS } from "../navigation";

const CustomersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { can } = useAuth();
  const canManage = can(ABILITIES.CUSTOMERS_MANAGE);
  const canMerge = can(ABILITIES.CUSTOMERS_MERGE);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isMergeOpen, setIsMergeOpen] = useState(false);

  const { onSubmit: handleAddCustomerSubmit, isPending } = useAddCustomer(() =>
    setIsAddOpen(false),
  );

  const columns: ColumnConfig<Customer>[] = [
    {
      key: "name",
      field: "name",
      labelKey: "customers.table_fields.name",
      sortable: true,
    },
    {
      key: "lastOrderAt",
      field: "lastOrderAt",
      labelKey: "customers.table_fields.lastOrderAt",
      sortable: true,
      sortKey: "last_order_at",
      renderCell: (value) => {
        if (!value) return <span>—</span>;
        const date = new Date(value as string);
        const formatted = `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
        return <span>{formatted}</span>;
      },
    },
    {
      key: "phones",
      field: "phones",
      labelKey: "customers.table_fields.mainPhone",
      sortable: false,
      renderCell: (value) => {
        const phones = value as Phone[];
        const mainPhone = phones.find((phone) => phone.isPrimary);
        return <span>{mainPhone?.phoneNumber}</span>;
      },
    },
  ];

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

  const onRowClick = (customer: Customer) => {
    navigate(CUSTOMERS_LINKS.detail(customer.id));
  };

  return (
    <>
      <SmartTable
        titleKey="breadcrumbs.customers"
        api={customersApi}
        queryKeyFn={queryKeys.customers.list}
        searchPlaceholder="search_placeholders.customer_phone"
        searchField="any_match"
        searchInputClassName="mb-0 flex-none w-full sm:w-[30rem]"
        filterBar={<CustomersFilterBar />}
        extraFilterKeys={[...CUSTOMERS_BOOLEAN_FILTER_KEYS]}
        columns={columns}
        headerActions={
          canManage || canMerge ? (
            <div className="flex items-center gap-2">
              {canMerge && <MergeButton onClick={() => setIsMergeOpen(true)} />}
              {canManage && <AddButton onClick={() => setIsAddOpen(true)} />}
            </div>
          ) : undefined
        }
        onRowClick={onRowClick}
      />
      <MergeCustomerDialog isOpen={isMergeOpen} onOpenChange={setIsMergeOpen} />
      <ItemFormDialog
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        title={t("customers.register_form.title")}
        fields={registerFields}
        schema={newCustomerSchema}
        cancelLabel={t("customers.register_form.cancel")}
        confirmLabel={t("customers.register_form.submit")}
        onConfirm={handleAddCustomerSubmit}
        isPending={isPending}
      />
    </>
  );
};

export default CustomersPage;
