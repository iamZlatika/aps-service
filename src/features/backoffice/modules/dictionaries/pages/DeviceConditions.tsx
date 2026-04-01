import { deviceConditionsApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTablePage } from "@/features/backoffice/modules/dictionaries/components/DictionaryTablePage.tsx";
import type {
  BaseItem,
  ColumnConfig,
} from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const columns: ColumnConfig<BaseItem>[] = [
  { key: "name", labelKey: "dictionaries.table_fields.name", sortable: true },
];

const DeviceConditionsPage = () => (
  <DictionaryTablePage
    titleKey="sidebar.dictionaries_list.device_conditions"
    api={deviceConditionsApi}
    queryKeyFn={queryKeys.dictionaries.deviceConditions}
    queryKey={queryKeys.dictionaries.deviceConditions()}
    columns={columns}
  />
);

export default DeviceConditionsPage;
