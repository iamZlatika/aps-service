import { repairOperationsApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTable } from "@/features/backoffice/modules/dictionaries/components/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const RepairOperationsPage = () => (
  <DictionaryTable
    titleKey="sidebar.dictionaries_list.repair_operations"
    api={repairOperationsApi}
    queryKeyFn={queryKeys.dictionaries.repairOperations}
    columns={[
      { key: "name", labelKey: "table.name", sortable: true },
      { key: "category", labelKey: "table.category", sortable: true },
      { key: "base_price", labelKey: "table.base_price", sortable: false },
    ]}
  />
);

export default RepairOperationsPage;
