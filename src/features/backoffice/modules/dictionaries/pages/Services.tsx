import { servicesApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTablePage } from "@/features/backoffice/modules/dictionaries/components/DictionaryTablePage.tsx";
import { type DictionaryItem } from "@/features/backoffice/modules/dictionaries/types.ts";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const ServicesPage = () => {
  const columns: ColumnConfig<DictionaryItem>[] = [
    {
      key: "name",
      field: "name",
      labelKey: "dictionaries.table_fields.name",
      sortable: true,
    },
  ];

  return (
    <DictionaryTablePage
      titleKey="sidebar.dictionaries_list.services"
      api={servicesApi}
      queryKeyFn={queryKeys.dictionaries.services}
      columns={columns}
    />
  );
};

export default ServicesPage;
