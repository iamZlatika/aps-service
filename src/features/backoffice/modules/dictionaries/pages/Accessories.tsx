import { accessoriesApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTablePage } from "@/features/backoffice/modules/dictionaries/components/DictionaryTablePage.tsx";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const columns: ColumnConfig[] = [
  { key: "name", labelKey: "dictionaries.table_fields.name", sortable: true },
];

const AccessoriesPage = () => (
  <DictionaryTablePage
    titleKey="sidebar.dictionaries_list.accessories"
    api={accessoriesApi}
    queryKeyFn={queryKeys.dictionaries.accessories}
    queryKey={queryKeys.dictionaries.accessories()}
    columns={columns}
  />
);

export default AccessoriesPage;
