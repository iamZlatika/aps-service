import { suppliersApi } from "@/features/backoffice/modules/dictionaries/api";
import { type Supplier } from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import { DictionaryTablePage } from "@/features/backoffice/modules/dictionaries/components/DictionaryTablePage.tsx";
import { PhoneDropdown } from "@/features/backoffice/modules/orders/components/PhoneDropdown.tsx";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const SuppliersPage = () => {
  const columns: ColumnConfig<Supplier>[] = [
    {
      key: "name",
      field: "name",
      labelKey: "dictionaries.table_fields.name",
      sortable: true,
    },
    {
      key: "manager_name",
      field: "manager_name",
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
      sortable: false,
      required: false,
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
      titleKey="sidebar.dictionaries_list.suppliers"
      api={suppliersApi}
      queryKeyFn={queryKeys.dictionaries.suppliers}
      columns={columns}
    />
  );
};

export default SuppliersPage;
