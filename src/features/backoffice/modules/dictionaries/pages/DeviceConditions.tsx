import { deviceConditionsApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { SmartTable } from "@/shared/components/table";

const DeviceConditionsPage = () => (
  <SmartTable
    titleKey="sidebar.dictionaries_list.device_conditions"
    api={deviceConditionsApi}
    queryKeyFn={queryKeys.dictionaries.deviceConditions}
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
