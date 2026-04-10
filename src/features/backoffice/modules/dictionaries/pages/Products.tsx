import { useTranslation } from "react-i18next";

import { productsApi } from "@/features/backoffice/modules/dictionaries/api";
import {
  type Product,
  type Supplier,
} from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import { DictionaryTablePage } from "@/features/backoffice/modules/dictionaries/components/DictionaryTablePage.tsx";
import { getRepairCategoryOptions } from "@/features/backoffice/modules/dictionaries/data.ts";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const ProductsPage = () => {
  const { t } = useTranslation();

  const columns: ColumnConfig<Product>[] = [
    {
      key: "name",
      field: "name",
      labelKey: "dictionaries.table_fields.name",
      sortable: true,
    },
    {
      key: "supplier",
      field: "supplier",
      labelKey: "dictionaries.table_fields.category",
      sortable: false,
      renderCell: (value) => {
        const supplier = value as Supplier;
        return supplier.name;
      },
      type: "select",
      options: getRepairCategoryOptions(t),
    },
    {
      key: "purchase_price",
      field: "purchase_price",
      labelKey: "dictionaries.table_fields.base_price",
      sortable: false,
      renderCell: (value) => `${value} ₴`,
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
