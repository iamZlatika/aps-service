import { outsourcersApi } from "@/features/dictionaries/api";
import { DictionaryTablePage } from "@/features/dictionaries/components/DictionaryTablePage.tsx";
import { type Outsourcer } from "@/features/dictionaries/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { PhoneDropdown } from "@/shared/components/PhoneDropdown";
import type { ColumnConfig } from "@/widgets/table/models/types.ts";

const OutsourcersPage = () => {
  const columns: ColumnConfig<Outsourcer>[] = [
    {
      key: "name",
      field: "name",
      labelKey: "dictionaries.table_fields.name",
      sortable: true,
    },
    {
      key: "managerName",
      field: "managerName",
      labelKey: "dictionaries.table_fields.managerName",
      sortable: true,
      required: false,
    },
    {
      key: "phone",
      field: "phone",
      labelKey: "dictionaries.table_fields.phone",
      sortable: false,
      required: false,
      type: "phone",
      renderCell: (value) =>
        value ? (
          <div className="flex flex-col">
            <PhoneDropdown phoneNumber={value.toString()} />
          </div>
        ) : null,
    },
    {
      key: "website",
      field: "website",
      labelKey: "dictionaries.table_fields.website",
      placeholderKey: "dictionaries.placeholders.website",
      sortable: false,
      required: false,
      type: "url",
      renderCell: (value) =>
        value ? (
          <a
            href={value.toString()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
          >
            {value}
          </a>
        ) : null,
    },
  ];

  return (
    <DictionaryTablePage
      titleKey="sidebar.dictionaries_list.outsourcers"
      api={outsourcersApi}
      queryKeyFn={queryKeys.dictionaries.outsourcers}
      columns={columns}
    />
  );
};

export default OutsourcersPage;
