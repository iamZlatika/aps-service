import { deviceTypesApi } from "@/features/backoffice/modules/dictionaries/api";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const DeviceTypesPage = () => (
  <SmartTable
    titleKey="sidebar.dictionaries_list.device_types"
    api={deviceTypesApi}
    queryKeyFn={queryKeys.dictionaries.deviceTypes}
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

export default DeviceTypesPage;
