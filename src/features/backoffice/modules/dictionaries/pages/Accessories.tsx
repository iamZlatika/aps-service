import { accessoriesApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { DictionaryTable } from "@/shared/components/table";

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
