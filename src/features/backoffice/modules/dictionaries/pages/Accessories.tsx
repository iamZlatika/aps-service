import { accessoriesApi } from "@/features/backoffice/modules/dictionaries/api";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const AccessoriesPage = () => (
  <SmartTable
    titleKey="sidebar.dictionaries_list.accessories"
    api={accessoriesApi}
    queryKeyFn={queryKeys.dictionaries.accessories}
    searchPlaceholder="search_placeholders.dictionaries_name"
    columns={[
      {
        key: "name",
        labelKey: "table.name",
        sortable: true,
      },
    ]}
  />
);

export default AccessoriesPage;
