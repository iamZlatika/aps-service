import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { type SearchableSelectOption } from "@/features/backoffice/modules/orders/components/searchable-select";
import { useDebounce } from "@/shared/hooks/useDebounce.ts";
import { SEARCH_DEBOUNCE_MS } from "@/shared/lib/constants.ts";
import { notifyError } from "@/shared/lib/errors/services.ts";

import { type CreateItemFn } from "./types.ts";

interface UseMultiSearchableSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  fetchItems: (search: string) => Promise<SearchableSelectOption[]>;
  queryKey: readonly unknown[];
  onCreateItem?: CreateItemFn;
  quickSelectLabels?: string[];
}

export const useMultiSearchableSelect = ({
  value,
  onChange,
  fetchItems,
  queryKey,
  onCreateItem,
  quickSelectLabels,
}: UseMultiSearchableSelectProps) => {
  const queryClientInstance = useQueryClient();

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const debouncedSearch = useDebounce(inputValue, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedSearch]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !e.composedPath().includes(containerRef.current)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const { data: allOptions = [], isFetching } = useQuery({
    queryKey: [...queryKey, debouncedSearch],
    queryFn: () => fetchItems(debouncedSearch),
    enabled: isOpen,
  });

  const valueSet = useMemo(() => new Set(value), [value]);
  const valueLowerSet = useMemo(
    () => new Set(value.map((v) => v.toLowerCase())),
    [value],
  );
  const options = useMemo(
    () => allOptions.filter((item) => !valueSet.has(item.name)),
    [allOptions, valueSet],
  );

  const quickSelectResults = useQueries({
    queries: (quickSelectLabels ?? []).map((label) => ({
      queryKey: [...queryKey, "__quickselect", label],
      queryFn: () => fetchItems(label),
      enabled: !!quickSelectLabels?.length,
      select: (items: SearchableSelectOption[]) =>
        items.find((item) => item.name.toLowerCase() === label.toLowerCase()),
    })),
  });
  const quickSelectOptions = useMemo(
    () =>
      quickSelectResults
        .map((r) => r.data)
        .filter(Boolean) as SearchableSelectOption[],
    [quickSelectResults],
  );

  const isAlreadySelected = useMemo(() => {
    const trimmed = inputValue.trim();
    return trimmed.length > 0 && valueLowerSet.has(trimmed.toLowerCase());
  }, [inputValue, valueLowerSet]);

  const canCreate =
    !!onCreateItem && inputValue.trim().length > 0 && !isAlreadySelected;

  const handleRemove = useCallback(
    (name: string) => {
      onChange(value.filter((v) => v !== name));
    },
    [onChange, value],
  );

  const handleQuickSelectToggle = useCallback(
    (name: string, checked: boolean) => {
      if (checked) {
        onChange([...value, name]);
      } else {
        onChange(value.filter((v) => v !== name));
      }
    },
    [onChange, value],
  );

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleSelect = useCallback(
    (option: SearchableSelectOption) => {
      onChange([...value, option.name]);
      setInputValue("");
      setActiveIndex(-1);
    },
    [onChange, value],
  );

  const { mutate: createItem, isPending: isSaving } = useMutation({
    mutationFn: (name: string) => {
      if (!onCreateItem) return Promise.resolve();
      return onCreateItem(name);
    },
    onSuccess: async (_data, name) => {
      await queryClientInstance.invalidateQueries({ queryKey: [...queryKey] });
      onChange([...value, name]);
      setInputValue("");
    },
    onError: (error) => notifyError(error),
  });

  const handleCreateItem = useCallback(() => {
    if (!canCreate) return;
    createItem(inputValue.trim());
  }, [canCreate, createItem, inputValue]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const scrollActiveIntoView = (index: number) => {
        const list = listRef.current;
        if (!list) return;
        const item = list.children[index] as HTMLElement | undefined;
        item?.scrollIntoView({ block: "nearest" });
      };

      if (e.key === "ArrowDown") {
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev < options.length - 1 ? prev + 1 : prev;
          scrollActiveIntoView(next);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev > 0 ? prev - 1 : prev;
          scrollActiveIntoView(next);
          return next;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < options.length) {
          handleSelect(options[activeIndex]);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setInputValue("");
        setActiveIndex(-1);
      } else if (e.key === "," && inputValue.trim()) {
        e.preventDefault();
        onChange([...value, inputValue.trim()]);
        setInputValue("");
        setActiveIndex(-1);
      } else if (
        e.key === "Backspace" &&
        inputValue === "" &&
        value.length > 0
      ) {
        onChange(value.slice(0, -1));
      }
    },
    [activeIndex, handleSelect, inputValue, isOpen, onChange, options, value],
  );

  return {
    inputValue,
    isOpen,
    canCreate,
    isAlreadySelected,
    valueSet,
    isSaving,
    activeIndex,
    containerRef,
    inputRef,
    listRef,
    options,
    quickSelectOptions,
    isFetching,
    handleRemove,
    handleQuickSelectToggle,
    handleInputChange,
    handleInputFocus,
    handleSelect,
    handleCreateItem,
    handleKeyDown,
  };
};
