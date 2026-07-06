import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type KeyboardEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import { useDebounce } from "@/shared/hooks/useDebounce.ts";
import { SEARCH_DEBOUNCE_MS } from "@/shared/lib/constants.ts";
import { notifyError } from "@/shared/lib/errors/services.ts";

import { type SearchableSelectOption } from "./types.ts";

type UseSearchableSelectParams<TMeta> = {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (option: SearchableSelectOption<TMeta>) => void;
  onClear?: () => void;
  fetchItems: (search: string) => Promise<SearchableSelectOption<TMeta>[]>;
  queryKey: readonly unknown[];
  clearOnSelect?: boolean;
  onCreateItem?: (
    name: string,
  ) => Promise<SearchableSelectOption<TMeta> | void>;
};

type UseSearchableSelectReturn<TMeta> = {
  inputValue: string;
  isOpen: boolean;
  activeIndex: number;
  options: SearchableSelectOption<TMeta>[];
  isFetching: boolean;
  canCreate: boolean;
  isSaving: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  listRef: RefObject<HTMLUListElement | null>;
  handleSelect: (option: SearchableSelectOption<TMeta>) => void;
  handleInputChange: (val: string) => void;
  handleInputFocus: () => void;
  handleInputBlur: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleClear: () => void;
  handleCreateItem: (name: string) => void;
};

export function useSearchableSelect<TMeta = undefined>({
  value,
  onChange,
  onSelect,
  onClear,
  fetchItems,
  queryKey,
  clearOnSelect,
  onCreateItem,
}: UseSearchableSelectParams<TMeta>): UseSearchableSelectReturn<TMeta> {
  const queryClient = useQueryClient();

  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const skipBlurRef = useRef(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const debouncedSearch = useDebounce(inputValue, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedSearch]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const { data: options = [], isFetching } = useQuery({
    queryKey: [...queryKey, debouncedSearch],
    queryFn: () => fetchItems(debouncedSearch),
    enabled: isOpen,
  });

  const canCreate = !!onCreateItem && inputValue.trim().length > 0;

  const { mutate: createItemMutate, isPending: isSaving } = useMutation({
    mutationFn: (name: string) => onCreateItem!(name),
    onSuccess: async (createdOption, name) => {
      await queryClient.invalidateQueries({ queryKey: [...queryKey] });
      if (createdOption) {
        onChange(createdOption.name);
        setInputValue(createdOption.name);
        onSelect?.(createdOption);
      } else {
        onChange(name);
        setInputValue(name);
      }
      setIsOpen(false);
    },
    onError: (error) => notifyError(error),
  });

  const handleSelect = (option: SearchableSelectOption<TMeta>) => {
    skipBlurRef.current = true;
    if (clearOnSelect) {
      onChange("");
      setInputValue("");
    } else {
      onChange(option.name);
      setInputValue(option.name);
    }
    onSelect?.(option);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    if (skipBlurRef.current) {
      skipBlurRef.current = false;
      return;
    }
    setIsOpen(false);
    setActiveIndex(-1);
    if (inputValue !== value) {
      onChange(inputValue);
    }
  };

  const scrollActiveIntoView = (index: number) => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Tab" && isOpen) {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!isOpen || options.length === 0) return;

    if (e.key === "ArrowDown") {
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
      setInputValue(value);
      setActiveIndex(-1);
      onChange(value);
    }
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    setIsOpen(false);
    setActiveIndex(-1);
    onClear?.();
  };

  const handleCreateItem = (name: string) => {
    createItemMutate(name);
  };

  return {
    inputValue,
    isOpen,
    activeIndex,
    options,
    isFetching,
    canCreate,
    isSaving,
    containerRef,
    listRef,
    handleSelect,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleKeyDown,
    handleClear,
    handleCreateItem,
  };
}
