import { SmartTable } from "@/features/backoffice/widgets/table";
import type {
  BaseItem,
  ColumnConfig,
} from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { Badge } from "@/shared/components/ui/badge.tsx";

import { customersApi } from "./api";

const CustomersPage = () => {
  const columns: ColumnConfig<BaseItem>[] = [
    { key: "name", labelKey: "customers.table_fields.name", sortable: true },
    {
      key: "lastOrderAt",
      labelKey: "customers.table_fields.lastOrderAt",
      sortable: false,
    },
    {
      key: "status",
      labelKey: "users.table_fields.status",
      sortable: true,
      renderCell: (value) => {
        const isActive = value === "active";

        return (
          <Badge className={isActive ? "..." : "..."}>
            {isActive ? "Active" : "Blocked"}
          </Badge>
        );
      },
    },
  ];
  return (
    <SmartTable
      titleKey="breadcrumbs.customers"
      api={customersApi}
      queryKeyFn={queryKeys.customers.list}
      searchPlaceholder="search_placeholders.users_name"
      columns={columns}
    />
  );
};

export default CustomersPage;
