import { useNavigate } from "react-router-dom";

import type { Customer } from "@/features/backoffice/modules/customers/types.ts";
import { AddButton } from "@/features/backoffice/modules/dictionaries/components/AddButton.tsx";
import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation.ts";
import { type Order } from "@/features/backoffice/modules/orders/types.ts";
import { SmartTable } from "@/features/backoffice/widgets/table";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const OrdersPage = () => {
  const navigate = useNavigate();

  const columns: ColumnConfig<Order>[] = [
    {
      key: "customerName",
      field: "customer",
      labelKey: "customers.table_fields.name",
      sortable: true,
      renderCell: (value) => {
        const customer = value as Customer;
        return <span>{customer.name}</span>;
      },
    },
    {
      key: "status",
      field: "status",
      labelKey: "customers.table_fields.lastOrderAt",
      sortable: true,
    },
    {
      key: "customerPhone",
      field: "customer",
      labelKey: "customers.table_fields.mainPhone",
      sortable: false,
      renderCell: (value) => {
        const customer = value as Customer;
        const mainPhone = customer.phones.find((phone) => phone.isPrimary);
        return <span>{mainPhone?.phoneNumber}</span>;
      },
    },
  ];

  return (
    <SmartTable
      titleKey="breadcrumbs.orders"
      api={ordersApi}
      queryKeyFn={queryKeys.orders.list}
      searchPlaceholder="search_placeholders.customer_phone"
      searchField="phone_number"
      searchNumbersOnly
      columns={columns}
      headerActions={
        <AddButton onClick={() => navigate(ORDERS_LINKS.newOrder())} />
      }
      // onRowClick={onRowClick}
    />
  );
};

export default OrdersPage;
