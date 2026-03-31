import { deviceModelsApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTablePage } from "@/features/backoffice/modules/dictionaries/components/DictionaryTablePage.tsx";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const columns: ColumnConfig[] = [
  { key: "name", labelKey: "dictionaries.table_fields.name", sortable: true },
];

const DeviceModelsPage = () => (
  <DictionaryTablePage
    titleKey="sidebar.dictionaries_list.device_models"
    api={deviceModelsApi}
    queryKeyFn={queryKeys.dictionaries.deviceModels}
    queryKey={queryKeys.dictionaries.deviceModels()}
    columns={columns}
  />
);

export default DeviceModelsPage;
