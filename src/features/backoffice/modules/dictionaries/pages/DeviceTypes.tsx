import { deviceTypesApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTablePage } from "@/features/backoffice/modules/dictionaries/components/DictionaryTablePage.tsx";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const columns: ColumnConfig[] = [
  { key: "name", labelKey: "dictionaries.table_fields.name", sortable: true },
];

const DeviceTypesPage = () => (
  <DictionaryTablePage
    titleKey="sidebar.dictionaries_list.device_types"
    api={deviceTypesApi}
    queryKeyFn={queryKeys.dictionaries.deviceTypes}
    queryKey={queryKeys.dictionaries.deviceTypes()}
    columns={columns}
  />
);

export default DeviceTypesPage;
