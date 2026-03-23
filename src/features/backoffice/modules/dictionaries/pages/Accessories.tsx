import { accessoriesApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTable } from "@/features/backoffice/modules/dictionaries/components/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const AccessoriesPage = () => (
  <DictionaryTable
    titleKey="sidebar.dictionaries_list.accessories"
    api={accessoriesApi}
    queryKeyFn={queryKeys.dictionaries.accessories}
    columns={[
      {
        key: "name",
        labelKey: "sidebar.dictionaries_list.table.name",
        sortable: true,
      },
    ]}
  />
);

export default AccessoriesPage;
