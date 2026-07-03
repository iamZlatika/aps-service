import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { type Filters } from "@/features/backoffice/widgets/table/models/types.ts";

const RESERVED_PARAMS = ["page", "sort_column", "sort_type", "id"];

type UseFilterParamsResult = {
  filters: Filters;
  setFilter: (fieldName: string, value: string) => void;
  setFilters: (entries: Record<string, string>) => void;
  resetFilters: () => void;
};

export const useFilterParams = (): UseFilterParamsResult => {
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
        next.delete("page");
        return next;
      });
    },
    [setSearchParams],
  );

  // Setting two related keys via two separate setFilter calls in the same handler
  // doesn't compose — the second call's `prev` snapshot doesn't see the first
  // call's update yet, so it wins and silently drops the first key. Use this for
  // any filter that writes multiple params at once (e.g. a date range).
  const setFilters = useCallback(
    (entries: Record<string, string>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(entries).forEach(([fieldName, value]) => {
          if (value) {
            next.set(fieldName, value);
          } else {
            next.delete(fieldName);
          }
        });
        next.delete("page");
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
      next.delete("page");
      return next;
    });
  }, [setSearchParams]);

  return { filters, setFilter, setFilters, resetFilters };
};
