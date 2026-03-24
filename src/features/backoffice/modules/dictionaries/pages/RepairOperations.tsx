import { repairOperationsApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { SmartTable } from "@/shared/components/table";

const RepairOperationsPage = () => (
  <SmartTable
    titleKey="sidebar.dictionaries_list.repair_operations"
    api={repairOperationsApi}
    queryKeyFn={queryKeys.dictionaries.repairOperations}
    columns={[
      {
        key: "name",
        labelKey: "table.fields.name",
        sortable: true,
      },
      {
        key: "category",
        labelKey: "table.fields.category",
        sortable: true,
      },
      {
        key: "base_price",
        labelKey: "table.fields.base_price",
        sortable: false,
      },
    ]}
  />
);

export default RepairOperationsPage;
