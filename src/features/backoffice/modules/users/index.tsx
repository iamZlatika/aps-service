import { usersApi } from "@/features/backoffice/modules/users/api";
import { SmartTable } from "@/features/backoffice/widgets/table";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const UsersPage = () => {
  const columns: ColumnConfig[] = [
    { key: "name", labelKey: "table.fields.name", sortable: false },
    { key: "role", labelKey: "table.fields.role", sortable: true },
    { key: "status", labelKey: "table.fields.status", sortable: true },
  ];

  return (
    <SmartTable
      titleKey="sidebar.users"
      api={usersApi}
      queryKeyFn={queryKeys.users.list}
      searchPlaceholder="search_placeholders.users_name"
      columns={columns}
    />
  );
};

export default UsersPage;
