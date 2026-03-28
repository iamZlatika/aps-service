import { manufacturersApi } from "@/features/backoffice/modules/dictionaries/api";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const ManufacturersPage = () => (
  <SmartTable
    titleKey="sidebar.dictionaries_list.manufacturers"
    api={manufacturersApi}
    queryKeyFn={queryKeys.dictionaries.manufacturers}
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

export default ManufacturersPage;
