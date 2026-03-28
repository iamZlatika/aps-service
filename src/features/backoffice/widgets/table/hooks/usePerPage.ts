import { useCallback, useState } from "react";

const STORAGE_KEY = "items_per_page";
const DEFAULT_PER_PAGE = 15;
const PER_PAGE_OPTIONS = [10, 15, 20, 25] as const;

export type PerPageOption = (typeof PER_PAGE_OPTIONS)[number];

function getStoredPerPage(): PerPageOption {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = Number(stored);
      if (PER_PAGE_OPTIONS.includes(parsed as PerPageOption)) {
        return parsed as PerPageOption;
      }
    }
  } catch {
    // localStorage
  }
  return DEFAULT_PER_PAGE;
}

export function usePerPage() {
  const [perPage, setPerPageState] = useState<PerPageOption>(getStoredPerPage);

  const setPerPage = useCallback((value: PerPageOption) => {
    setPerPageState(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // ignore
    }
  }, []);

  return { perPage, setPerPage, perPageOptions: PER_PAGE_OPTIONS };
}
