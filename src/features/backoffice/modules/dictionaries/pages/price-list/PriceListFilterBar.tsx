import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { SearchFilter } from "@/features/backoffice/widgets/table/components/filters/FilterInput";

import { CategoryFilter } from "./CategoryFilter";

export const PriceListFilterBar = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (_: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set("name", value);
      } else {
        next.delete("name");
      }
      next.delete("page");
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-0">
      <SearchFilter
        fieldName="name"
        placeholder={t("search_placeholders.dictionaries_name")}
        value={searchParams.get("name") ?? ""}
        onChange={handleSearch}
        className="mb-4 w-56 sm:w-[30rem]"
      />
      <CategoryFilter />
    </div>
  );
};
