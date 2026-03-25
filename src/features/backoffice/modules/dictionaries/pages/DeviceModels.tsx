import { deviceModelsApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { SmartTable } from "@/shared/components/table";

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
