import { useTranslation } from "react-i18next";

import { repairOperationsApi } from "@/features/backoffice/modules/dictionaries/api";
import { getRepairCategoryOptions } from "@/features/backoffice/modules/dictionaries/data.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { SmartTable } from "@/shared/components/table";
import type { ColumnConfig } from "@/shared/components/table/types.ts";

const RepairOperationsPage = () => {
  const { t } = useTranslation();

  const columns: ColumnConfig[] = [
    {
      key: "name",
      labelKey: "table.fields.name",
      sortable: true,
    },
    {
      key: "category",
      labelKey: "table.fields.category",
      sortable: true,
      type: "select",
      options: getRepairCategoryOptions(t),
    },
    {
      key: "base_price",
      labelKey: "table.fields.base_price",
      sortable: false,
    },
  ];

  return (
    <SmartTable
      titleKey="sidebar.dictionaries_list.repair_operations"
      api={repairOperationsApi}
      queryKeyFn={queryKeys.dictionaries.repairOperations}
      columns={columns}
    />
  );
};

export default RepairOperationsPage;
