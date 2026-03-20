import { deviceTypesApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTable } from "@/features/backoffice/modules/dictionaries/components/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const DeviceTypesPage = () => (
  <DictionaryTable
    titleKey="sidebar.dictionaries_list.device_types"
    api={deviceTypesApi}
    queryKeyFn={queryKeys.dictionaries.deviceTypes}
  />
);

export default DeviceTypesPage;
