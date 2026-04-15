import { useQuery } from "@tanstack/react-query";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { type KeyboardEvent } from "react";
import type { FieldError } from "react-hook-form";

import {
  type SearchableSelectInputProps,
  type SearchableSelectOption,
} from "@/features/backoffice/modules/orders/components/searchable-select/searchableSelect.types.ts";
import { useDebounce } from "@/shared/hooks/useDebounce.ts";
import { SEARCH_DEBOUNCE_MS } from "@/shared/lib/constants.ts";
import { cn } from "@/shared/lib/utils.ts";

export type { SearchableSelectOption };

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (option: SearchableSelectOption) => void;
  renderOption?: (option: SearchableSelectOption) => ReactNode;
  renderInput?: (props: SearchableSelectInputProps) => ReactNode;
  fetchItems: (search: string) => Promise<SearchableSelectOption[]>;
  queryKey: readonly unknown[];
  placeholder?: string;
  disabled?: boolean;
  error?: FieldError;
  clearOnSelect?: boolean;
}

const defaultRenderInput = (props: SearchableSelectInputProps) => (
  <input
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
    onFocus={props.onFocus}
    onBlur={props.onBlur}
    onKeyDown={props.onKeyDown}
    placeholder={props.placeholder}
    disabled={props.disabled}
    className={cn(
      "flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      props.hasError && "border-destructive",
    )}
  />
);

const SearchableSelect = ({
  value,
  onChange,
  onSelect,
  renderOption,
  renderInput,
  fetchItems,
  queryKey,
  placeholder,
  disabled,
  error,
  clearOnSelect,
}: SearchableSelectProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const skipBlurRef = useRef(false);
  const isProgrammaticUpdateRef = useRef(false);

  useEffect(() => {
    isProgrammaticUpdateRef.current = true;
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

  const handleSelect = (option: SearchableSelectOption) => {
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
    if (isProgrammaticUpdateRef.current) {
      isProgrammaticUpdateRef.current = false;
      setInputValue(val);
      return;
    }
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

  const inputProps: SearchableSelectInputProps = {
    value: inputValue,
    onChange: handleInputChange,
    onFocus: handleInputFocus,
    onBlur: handleInputBlur,
    onKeyDown: handleKeyDown,
    placeholder,
    disabled,
    hasError: !!error,
  };

  return (
    <div ref={containerRef} className="relative">
      {(renderInput ?? defaultRenderInput)(inputProps)}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          {isFetching ? (
            <div className="px-3 py-2 text-base text-muted-foreground">...</div>
          ) : options.length === 0 ? (
            <div className="px-3 py-2 text-base text-muted-foreground">
              No results
            </div>
          ) : (
            <ul ref={listRef} className="max-h-60 overflow-y-auto p-1">
              {options.map((option, index) => (
                <li
                  key={option.id}
                  onMouseDown={() => handleSelect(option)}
                  className={cn(
                    "relative flex cursor-pointer select-none flex-col rounded-sm px-2 py-1.5 outline-none",
                    index === activeIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                    option.name === value &&
                      index !== activeIndex &&
                      "font-medium text-accent-foreground",
                  )}
                >
                  {renderOption ? renderOption(option) : option.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
};

export default SearchableSelect;
