import { locationApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTablePage } from "@/features/backoffice/modules/dictionaries/components/DictionaryTablePage.tsx";
import { type Location } from "@/features/backoffice/modules/dictionaries/types.ts";
import { PhoneDropdown } from "@/features/backoffice/modules/orders/components/PhoneDropdown.tsx";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const LocationsPage = () => {
  const columns: ColumnConfig<Location>[] = [
    {
      key: "name",
      field: "name",
      labelKey: "dictionaries.table_fields.name",
      sortable: true,
    },
    {
      key: "address",
      field: "address",
      labelKey: "dictionaries.table_fields.address",
      sortable: true,
    },
    {
      key: "phone",
      field: "phone",
      labelKey: "dictionaries.table_fields.phone",
      sortable: false,
      type: "phone",
      renderCell: (value) => {
        if (typeof value !== "string") return null;

        return (
          <div className="flex flex-col">
            <PhoneDropdown phoneNumber={value} />
          </div>
        );
      },
    },
    {
      key: "schedule",
      field: "schedule",
      labelKey: "dictionaries.table_fields.schedule",
      sortable: false,
      required: false,
    },
  ];

  return (
    <DictionaryTablePage
      titleKey="sidebar.dictionaries_list.locations"
      api={locationApi}
      queryKeyFn={queryKeys.dictionaries.locations}
      columns={columns}
    />
  );
};

export default LocationsPage;
