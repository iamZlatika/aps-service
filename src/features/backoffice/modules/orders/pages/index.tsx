import { useNavigate } from "react-router-dom";

import type { Customer } from "@/features/backoffice/modules/customers/types.ts";
import { AddButton } from "@/features/backoffice/modules/dictionaries/components/AddButton.tsx";
import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { PhoneDropdown } from "@/features/backoffice/modules/orders/components/PhoneDropdown.tsx";
import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation.ts";
import { type Order } from "@/features/backoffice/modules/orders/types.ts";
import { SmartTable } from "@/features/backoffice/widgets/table";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const OrdersPage = () => {
  const navigate = useNavigate();

  const columns: ColumnConfig<Order>[] = [
    // {
    //   key: "customerName",
    //   field: "customer",
    //   labelKey: "customers.table_fields.name",
    //   sortable: true,
    //   renderCell: (value) => {
    //     const customer = value as Customer;
    //     return <span>{customer.name}</span>;
    //   },
    // },
    {
      key: "status",
      field: "status",
      labelKey: "orders.table_fields.status",
      sortable: true,
    },
    {
      key: "customerName",
      field: "customer",
      labelKey: "orders.table_fields.customer",
      sortable: true,
      renderCell: (value) => {
        const customer = value as Customer;

        const primaryPhone = customer.phones.find((p) => p.isPrimary);

        return (
          <div className="flex flex-col">
            <span>{customer.name}</span>

            {primaryPhone && (
              <PhoneDropdown phoneNumber={primaryPhone.phoneNumber} />
            )}
          </div>
        );
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
