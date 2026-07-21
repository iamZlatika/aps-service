import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ABILITIES } from "@/features/auth/abilities.ts";
import { priceListApi } from "@/features/dictionaries/api";
import { DictionaryTablePage } from "@/features/dictionaries/components/DictionaryTablePage";
import type {
  PriceListCategory,
  PriceListItem,
} from "@/features/dictionaries/types";
import { queryKeys } from "@/shared/api/queryKeys";
import { useLocalize } from "@/shared/hooks/useLocalize";
import type { ColumnConfig, FieldConfig } from "@/widgets/table/models/types";

import { PRICE_LIST_CATEGORIES } from "./categories";
import { PriceListFilterBar } from "./PriceListFilterBar";

const PriceListPage = () => {
  const { t } = useTranslation();
  const localize = useLocalize();

  const columns = useMemo<ColumnConfig<PriceListItem>[]>(
    () => [
      {
        key: "name",
        field: "nameRu",
        labelKey: "dictionaries.table_fields.name",
        sortable: false,
        renderCell: (_, item) => localize(item.nameRu, item.nameUk),
        formField: false,
      },
      {
        key: "category",
        field: "category",
        labelKey: "dictionaries.table_fields.category",
        sortable: false,
        renderCell: (_, item) =>
          localize(item.category.nameRu, item.category.nameUk),
        formField: false,
      },
      {
        key: "price",
        field: "price",
        labelKey: "dictionaries.table_fields.price",
        sortable: false,
        renderCell: (price) => (price === 0 ? "—" : `${price} ₴`),
        formField: false,
      },
      {
        key: "priceNote",
        field: "priceNoteRu",
        labelKey: "dictionaries.table_fields.price_note",
        sortable: false,
        renderCell: (_, item) =>
          localize(item.priceNoteRu ?? "", item.priceNoteUk ?? "") || "—",
        formField: false,
      },
    ],
    [localize],
  );

  const categoryOptions = useMemo(
    () =>
      Object.entries(PRICE_LIST_CATEGORIES).map(([key, cat]) => ({
        value: key,
        label: localize(cat.nameRu, cat.nameUk),
      })),
    [localize],
  );

  const formFields = useMemo<FieldConfig[]>(
    () => [
      {
        key: "nameRu",
        label: t("dictionaries.table_fields.name_ru"),
        placeholder: t("dictionaries.table_fields.name_ru"),
        required: true,
      },
      {
        key: "nameUk",
        label: t("dictionaries.table_fields.name_ua"),
        placeholder: t("dictionaries.table_fields.name_ua"),
        required: true,
      },
      {
        key: "category",
        label: t("dictionaries.table_fields.category"),
        type: "select",
        options: categoryOptions,
        required: true,
        getInitialValue: (item) => (item.category as PriceListCategory)?.key,
      },
      {
        key: "price",
        label: t("dictionaries.table_fields.price"),
        inputType: "number",
        required: true,
      },
      {
        key: "priceNoteRu",
        label: t("dictionaries.table_fields.price_note_ru"),
        required: false,
      },
      {
        key: "priceNoteUk",
        label: t("dictionaries.table_fields.price_note_uk"),
        required: false,
      },
      {
        key: "sortOrder",
        label: t("dictionaries.table_fields.sort_order"),
        inputType: "number",
        required: true,
      },
    ],
    [t, categoryOptions],
  );

  return (
    <DictionaryTablePage
      titleKey="sidebar.dictionaries_list.price_list"
      api={priceListApi}
      queryKeyFn={queryKeys.dictionaries.priceList}
      columns={columns}
      formFields={formFields}
      searchField=""
      filterBar={<PriceListFilterBar />}
      extraFilterKeys={["categories[]", "name"]}
      tableClassName="max-w-[2560px] lg:max-w-[2560px]"
      getItemName={(item) => localize(item.nameRu, item.nameUk)}
      manageAbility={ABILITIES.DICTIONARIES_PRICE_LIST_MANAGE}
    />
  );
};

export default PriceListPage;
