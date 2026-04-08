import { useTranslation } from "react-i18next";

import { repairOperationsApi } from "@/features/backoffice/modules/dictionaries/api";
import type { RepairOperationItem } from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import { DictionaryTablePage } from "@/features/backoffice/modules/dictionaries/components/DictionaryTablePage.tsx";
import { getRepairCategoryOptions } from "@/features/backoffice/modules/dictionaries/data.ts";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const RepairOperationsPage = () => {
  const { t } = useTranslation();

  const columns: ColumnConfig<RepairOperationItem>[] = [
    {
      key: "name",
      field: "name",
      labelKey: "dictionaries.table_fields.name",
      sortable: true,
    },
    {
      key: "category",
      field: "category",
      labelKey: "dictionaries.table_fields.category",
      sortable: true,
      type: "select",
      options: getRepairCategoryOptions(t),
    },
    {
      key: "base_price",
      field: "base_price",
      labelKey: "dictionaries.table_fields.base_price",
      sortable: false,
      renderCell: (value) => `${value} ₴`,
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
