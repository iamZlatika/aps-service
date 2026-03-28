import { deviceModelsApi } from "@/features/backoffice/modules/dictionaries/api";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const DeviceModelsPage = () => (
  <SmartTable
    titleKey="sidebar.dictionaries_list.device_models"
    api={deviceModelsApi}
    queryKeyFn={queryKeys.dictionaries.deviceModels}
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

export default DeviceModelsPage;
