import { deviceConditionsApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { DictionaryTable } from "@/shared/components/table";

const DeviceConditionsPage = () => (
  <DictionaryTable
    titleKey="sidebar.dictionaries_list.device_conditions"
    api={deviceConditionsApi}
    queryKeyFn={queryKeys.dictionaries.deviceConditions}
    columns={[
      {
        key: "name",
        labelKey: "sidebar.dictionaries_list.table.name",
        sortable: true,
      },
    ]}
  />
);

export default DeviceConditionsPage;
