import { X } from "lucide-react";
import { type ReactNode } from "react";
import { type KeyboardEvent } from "react";
import type { FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useIsMobile } from "@/shared/hooks/useMobile.ts";
import { cn } from "@/shared/lib/utils.ts";

import {
  type SearchableSelectInputProps,
  type SearchableSelectOption,
} from "./types.ts";
import { useSearchableSelect } from "./useSearchableSelect.ts";

export type { SearchableSelectInputProps, SearchableSelectOption };

const ITEM_HEIGHT = 36;
const LIST_PADDING = 8;

interface SearchableSelectProps<TMeta = undefined> {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (option: SearchableSelectOption<TMeta>) => void;
  renderOption?: (option: SearchableSelectOption<TMeta>) => ReactNode;
  renderInput?: (props: SearchableSelectInputProps) => ReactNode;
  fetchItems: (search: string) => Promise<SearchableSelectOption<TMeta>[]>;
  queryKey: readonly unknown[];
  placeholder?: string;
  disabled?: boolean;
  error?: FieldError;
  clearOnSelect?: boolean;
  onClear?: () => void;
  onCreateItem?: (
    name: string,
  ) => Promise<SearchableSelectOption<TMeta> | void>;
  dropUp?: boolean;
  maxVisible?: number;
  extraOptions?: SearchableSelectOption<TMeta>[];
}

const defaultRenderInput = (props: SearchableSelectInputProps) => (
  <div className="relative">
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
        props.onClear && props.value && "pr-8",
      )}
    />
    {props.onClear && props.value && (
      <button
        type="button"
        tabIndex={-1}
        onMouseDown={() => {
          props.onClear!();
        }}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        <X size={15} />
      </button>
    )}
  </div>
);

function SearchableSelect<TMeta = undefined>({
  value,
  onChange,
  onSelect,
  onClear,
  renderOption,
  renderInput,
  fetchItems,
  queryKey,
  placeholder,
  disabled,
  error,
  clearOnSelect,
  onCreateItem,
  dropUp,
  maxVisible,
  extraOptions,
}: SearchableSelectProps<TMeta>) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const visibleCount = maxVisible ?? (isMobile ? 3 : 5);

  const {
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
  } = useSearchableSelect({
    value,
    onChange,
    onSelect,
    onClear,
    fetchItems,
    queryKey,
    clearOnSelect,
    onCreateItem,
    extraOptions,
  });

  const inputProps: SearchableSelectInputProps = {
    value: inputValue,
    onChange: handleInputChange,
    onFocus: handleInputFocus,
    onBlur: handleInputBlur,
    onKeyDown: handleKeyDown as (e: KeyboardEvent) => void,
    onClear: handleClear,
    placeholder,
    disabled,
    hasError: !!error,
  };

  return (
    <div ref={containerRef} className="relative">
      {(renderInput ?? defaultRenderInput)(inputProps)}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-full rounded-md border bg-popover text-popover-foreground shadow-md",
            dropUp ? "bottom-full mb-1" : "mt-1",
          )}
        >
          {isFetching ? (
            <div className="px-3 py-2 text-base text-muted-foreground">...</div>
          ) : options.length === 0 ? (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-base text-muted-foreground">
                {t("common.noResults")}
              </span>
              {canCreate && (
                <button
                  type="button"
                  tabIndex={-1}
                  disabled={isSaving}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleCreateItem(inputValue.trim());
                  }}
                  className="ml-2 shrink-0 rounded-sm bg-primary px-2 py-1 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSaving ? "..." : t("common.save")}
                </button>
              )}
            </div>
          ) : (
            <ul
              ref={listRef}
              style={{ maxHeight: visibleCount * ITEM_HEIGHT + LIST_PADDING }}
              className="overflow-y-auto p-1"
            >
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
}

export default SearchableSelect;
