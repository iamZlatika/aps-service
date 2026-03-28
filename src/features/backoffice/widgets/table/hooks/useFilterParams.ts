import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { type Filters } from "@/features/backoffice/widgets/table/models/types.ts";

const RESERVED_PARAMS = ["page", "per_page", "sort_column", "sort_type"];

export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: Filters = useMemo(() => {
    const result: Filters = {};
    searchParams.forEach((value, key) => {
      if (!RESERVED_PARAMS.includes(key) && value) {
        result[key] = value;
      }
    });
    return result;
  }, [searchParams]);

  const setFilter = useCallback(
    (fieldName: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(fieldName, value);
        } else {
          next.delete(fieldName);
        }
        next.set("page", "1");
        return next;
      });
    },
    [setSearchParams],
  );

  const setFilters = useCallback(
    (newFilters: Filters) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        Object.entries(newFilters).forEach(([key, value]) => {
          if (value) {
            next.set(key, value);
          } else {
            next.delete(key);
          }
        });

        next.set("page", "1");
        return next;
      });
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams();
      RESERVED_PARAMS.forEach((key) => {
        const val = prev.get(key);
        if (val) next.set(key, val);
      });
      return next;
    });
  }, [setSearchParams]);

  return { filters, setFilter, setFilters, resetFilters };
};
