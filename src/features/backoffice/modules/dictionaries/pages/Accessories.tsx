import { accessoriesApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { SmartTable } from "@/shared/components/table";

const AccessoriesPage = () => (
  <SmartTable
    titleKey="sidebar.dictionaries_list.accessories"
    api={accessoriesApi}
    queryKeyFn={queryKeys.dictionaries.accessories}
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
