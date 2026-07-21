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
        const next = new URLSearchParams(prev);
        const currentColumn = next.get("sort_column");
        const currentType = next.get("sort_type");

        if (currentColumn !== column) {
          next.set("sort_column", column);
          next.set("sort_type", "asc");
        } else if (currentType === "asc") {
          next.set("sort_column", column);
          next.set("sort_type", "desc");
        } else {
          next.delete("sort_column");
          next.delete("sort_type");
        }

        next.delete("page");
        return next;
      });
    },
    [setSearchParams],
  );

  return { sort, toggleSort };
};
