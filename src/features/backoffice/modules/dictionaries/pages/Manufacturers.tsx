import { manufacturersApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTablePage } from "@/features/backoffice/modules/dictionaries/components/DictionaryTablePage.tsx";
import type { DictionaryItem } from "@/features/backoffice/modules/dictionaries/types.ts";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const columns: ColumnConfig<DictionaryItem>[] = [
  {
    key: "name",
    field: "name",
    labelKey: "dictionaries.table_fields.name",
    sortable: true,
  },
];

const ManufacturersPage = () => (
  <DictionaryTablePage
    titleKey="sidebar.dictionaries_list.manufacturers"
    api={manufacturersApi}
    queryKeyFn={queryKeys.dictionaries.manufacturers}
    columns={columns}
  />
);

export default ManufacturersPage;
