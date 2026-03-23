import { manufacturersApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { DictionaryTable } from "@/shared/components/table";

const ManufacturersPage = () => (
  <DictionaryTable
    titleKey="sidebar.dictionaries_list.manufacturers"
    api={manufacturersApi}
    queryKeyFn={queryKeys.dictionaries.manufacturers}
    columns={[
      {
        key: "name",
        labelKey: "sidebar.dictionaries_list.table.name",
        sortable: true,
      },
    ]}
  />
);

export default ManufacturersPage;
