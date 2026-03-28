import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export function usePageParam() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const setPage = useCallback(
    (value: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value <= 1) {
          next.delete("page");
        } else {
          next.set("page", String(value));
        }
        return next;
      });
    },
    [setSearchParams],
  );

  return { page, setPage };
}
