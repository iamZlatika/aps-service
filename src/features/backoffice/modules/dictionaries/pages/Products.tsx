import { productsApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTablePage } from "@/features/backoffice/modules/dictionaries/components/DictionaryTablePage.tsx";
import { type DictionaryItem } from "@/features/backoffice/modules/dictionaries/types.ts";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const ProductsPage = () => {
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
      titleKey="sidebar.dictionaries_list.products"
      api={productsApi}
      queryKeyFn={queryKeys.dictionaries.products}
      columns={columns}
    />
  );
};

export default ProductsPage;
