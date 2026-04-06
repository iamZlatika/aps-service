import { useCallback, useState } from "react";

const DEFAULT_PER_PAGE = 15;
const PER_PAGE_OPTIONS = [10, 15, 20, 25] as const;

export type PerPageOption = (typeof PER_PAGE_OPTIONS)[number];

function getStoredPerPage(storageKey: string): PerPageOption {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = Number(stored);
      if (PER_PAGE_OPTIONS.includes(parsed as PerPageOption)) {
        return parsed as PerPageOption;
      }
    }
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_PER_PAGE;
}

export function usePerPage(tableKey: string) {
  const storageKey = `items_per_page_${tableKey}`;
  const [perPage, setPerPageState] = useState<PerPageOption>(() =>
    getStoredPerPage(storageKey),
  );

  const setPerPage = useCallback(
    (value: PerPageOption) => {
      setPerPageState(value);
      try {
        localStorage.setItem(storageKey, String(value));
      } catch {
        // ignore
      }
    },
    [storageKey],
  );

  return { perPage, setPerPage, perPageOptions: PER_PAGE_OPTIONS };
}
