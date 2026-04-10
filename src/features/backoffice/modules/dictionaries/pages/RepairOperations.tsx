import { repairOperationsApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTablePage } from "@/features/backoffice/modules/dictionaries/components/DictionaryTablePage.tsx";
import { type DictionaryItem } from "@/features/backoffice/modules/dictionaries/types.ts";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const RepairOperationsPage = () => {
  const columns: ColumnConfig<DictionaryItem>[] = [
    {
      key: "name",
      field: "name",
      labelKey: "dictionaries.table_fields.name",
      sortable: true,
    },
  ];

  return (
    <DictionaryTablePage
      titleKey="sidebar.dictionaries_list.repair_operations"
      api={repairOperationsApi}
      queryKeyFn={queryKeys.dictionaries.repairOperations}
      columns={columns}
    />
  );
};

export default RepairOperationsPage;
