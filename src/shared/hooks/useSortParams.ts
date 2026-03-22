import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export type SortType = "asc" | "desc" | "none";

export interface SortState {
  column: string | null;
  type: SortType;
}

export const useSortParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const columnParam = searchParams.get("sort_column");
  const typeParam = searchParams.get("sort_type") as SortType | null;

  const sort: SortState = {
    column: columnParam,
    type:
      typeParam && (typeParam === "asc" || typeParam === "desc")
        ? typeParam
        : "none",
  };

  const toggleSort = useCallback(
    (column: string) => {
      setSearchParams((prev) => {
        const currentColumn = prev.get("sort_column");
        const currentType = prev.get("sort_type");

        if (currentColumn !== column) {
          prev.set("sort_column", column);
          prev.set("sort_type", "asc");
        } else if (currentType === "asc") {
          prev.set("sort_column", column);
          prev.set("sort_type", "desc");
        } else {
          prev.delete("sort_column");
          prev.delete("sort_type");
        }

        prev.set("page", "1");
        return prev;
      });
    },
    [setSearchParams],
  );

  return { sort, toggleSort };
};
