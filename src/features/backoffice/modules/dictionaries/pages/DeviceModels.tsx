import { deviceModelsApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { DictionaryTable } from "@/shared/components/table";

const DeviceModelsPage = () => (
  <DictionaryTable
    titleKey="sidebar.dictionaries_list.device_models"
    api={deviceModelsApi}
    queryKeyFn={queryKeys.dictionaries.deviceModels}
    columns={[
      {
        key: "name",
        labelKey: "sidebar.dictionaries_list.table.name",
        sortable: true,
      },
    ]}
  />
);

export default DeviceModelsPage;
