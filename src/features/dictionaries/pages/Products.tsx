import { productsApi } from "@/features/dictionaries/api";
import { DictionaryTablePage } from "@/features/dictionaries/components/DictionaryTablePage.tsx";
import { type DictionaryItem } from "@/features/dictionaries/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import type { ColumnConfig } from "@/widgets/table/models/types.ts";

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
