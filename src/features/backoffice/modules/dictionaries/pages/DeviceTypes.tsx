import { deviceTypesApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { DictionaryTable } from "@/shared/components/table";

const DeviceTypesPage = () => (
  <DictionaryTable
    titleKey="sidebar.dictionaries_list.device_types"
    api={deviceTypesApi}
    queryKeyFn={queryKeys.dictionaries.deviceTypes}
    columns={[
      {
        key: "name",
        labelKey: "sidebar.dictionaries_list.table.name",
        sortable: true,
      },
    ]}
  />
);

export default DeviceTypesPage;
