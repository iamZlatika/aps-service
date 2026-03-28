import { deviceConditionsApi } from "@/features/backoffice/modules/dictionaries/api";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const DeviceConditionsPage = () => (
  <SmartTable
    titleKey="sidebar.dictionaries_list.device_conditions"
    api={deviceConditionsApi}
    queryKeyFn={queryKeys.dictionaries.deviceConditions}
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

export default DeviceConditionsPage;
