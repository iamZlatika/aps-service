import { repairOperationsApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { DictionaryTable } from "@/shared/components/table";

const RepairOperationsPage = () => (
  <DictionaryTable
    titleKey="sidebar.dictionaries_list.repair_operations"
    api={repairOperationsApi}
    queryKeyFn={queryKeys.dictionaries.repairOperations}
    columns={[
      {
        key: "name",
        labelKey: "sidebar.dictionaries_list.table.fields.name",
        sortable: true,
      },
      {
        key: "category",
        labelKey: "sidebar.dictionaries_list.table.fields.category",
        sortable: true,
      },
      {
        key: "base_price",
        labelKey: "sidebar.dictionaries_list.table.fields.base_price",
        sortable: false,
      },
    ]}
  />
);

export default RepairOperationsPage;
