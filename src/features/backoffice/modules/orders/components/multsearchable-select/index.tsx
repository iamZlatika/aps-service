import { X } from "lucide-react";
import { type FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { type SearchableSelectOption } from "@/features/backoffice/modules/orders/components/searchable-select";
import { Badge } from "@/shared/components/ui/badge.tsx";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import { cn } from "@/shared/lib/utils.ts";

import { type CreateItemFn } from "./types.ts";
import { useMultiSearchableSelect } from "./useMultiSearchableSelect.ts";

export type { CreateItemFn } from "./types.ts";

interface MultiSearchableSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  fetchItems: (search: string) => Promise<SearchableSelectOption[]>;
  queryKey: readonly unknown[];
  placeholder?: string;
  error?: FieldError;
  onCreateItem?: CreateItemFn;
  quickSelectLabels?: string[];
}

export const MultiSearchableSelect = ({
  value,
  onChange,
  fetchItems,
  queryKey,
  placeholder,
  error,
  onCreateItem,
  quickSelectLabels,
}: MultiSearchableSelectProps) => {
  const { t } = useTranslation();

  const {
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
  } = useMultiSearchableSelect({
    value,
    onChange,
    fetchItems,
    queryKey,
    onCreateItem,
    quickSelectLabels,
  });

  return (
    <div ref={containerRef} className="relative">
      {quickSelectOptions.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1.5">
          {quickSelectOptions.map((item) => (
            <div key={item.id} className="flex items-center gap-1.5">
              <Checkbox
                id={`qs-${item.id}`}
                checked={valueSet.has(item.name)}
                onCheckedChange={(checked) =>
                  handleQuickSelectToggle(item.name, !!checked)
                }
              />
              <label
                htmlFor={`qs-${item.id}`}
                className="cursor-pointer text-sm"
              >
                {item.name}
              </label>
            </div>
          ))}
        </div>
      )}
      <div
        className={cn(
          "flex min-h-11 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm",
          isOpen && "ring-1 ring-ring",
          error && "border-destructive",
        )}
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest("[data-remove]")) {
            e.preventDefault();
          }
        }}
        onClick={(e) => {
          const removeBtn = (e.target as HTMLElement).closest("[data-remove]");
          if (removeBtn) {
            handleRemove(removeBtn.getAttribute("data-remove")!);
          } else {
            inputRef.current?.focus();
          }
        }}
      >
        {value.map((item) => (
          <Badge
            key={item}
            variant="secondary"
            className="h-7 shrink-0 gap-1 py-0.5 text-sm"
          >
            {item}
            <button type="button" data-remove={item}>
              <X size={12} />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          {isFetching ? (
            <div className="px-3 py-2 text-base text-muted-foreground">...</div>
          ) : options.length === 0 ? (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-base text-muted-foreground">
                {isAlreadySelected
                  ? t("common.alreadySelected")
                  : t("common.noResults")}
              </span>
              {canCreate && (
                <button
                  type="button"
                  disabled={isSaving}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleCreateItem();
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
              className="max-h-60 overflow-y-auto p-1"
              onMouseDown={(e) => {
                const li = (e.target as HTMLElement).closest(
                  "[data-option-id]",
                );
                if (!li) return;
                e.preventDefault();
                const id = li.getAttribute("data-option-id");
                const option = options.find((o) => String(o.id) === id);
                if (option) handleSelect(option);
              }}
            >
              {options.map((option, index) => (
                <li
                  key={option.id}
                  data-option-id={option.id}
                  className={cn(
                    "relative flex cursor-pointer select-none flex-col rounded-sm px-2 py-1.5 outline-none",
                    index === activeIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {option.name}
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
