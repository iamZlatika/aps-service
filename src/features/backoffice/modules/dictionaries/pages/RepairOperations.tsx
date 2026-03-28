import { useTranslation } from "react-i18next";

import { repairOperationsApi } from "@/features/backoffice/modules/dictionaries/api";
import { getRepairCategoryOptions } from "@/features/backoffice/modules/dictionaries/data.ts";
import { SmartTable } from "@/features/backoffice/widgets/table";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

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
      searchPlaceholder="search_placeholders.dictionaries_name"
      columns={columns}
    />
  );
};

export default RepairOperationsPage;
