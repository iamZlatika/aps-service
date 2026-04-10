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
    },
    {
      key: "phone",
      field: "phone",
      labelKey: "dictionaries.table_fields.phone",
      sortable: false,
      type: "phone",
      renderCell: (value) => (
        <div className="flex flex-col">
          <PhoneDropdown phoneNumber={value.toString()} />
        </div>
      ),
    },
    {
      key: "website",
      field: "website",
      labelKey: "dictionaries.table_fields.website",
      sortable: false,
      renderCell: (value) => (
        <a
          href={value.toString()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
        >
          {value}
        </a>
      ),
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
