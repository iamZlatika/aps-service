import { useEffect, useState } from "react";
import type { FieldError } from "react-hook-form";

import SearchableSelect from "@/features/backoffice/modules/orders/components/searchable-select";
import type { SearchableSelectOption } from "@/features/backoffice/modules/orders/components/searchable-select/searchableSelect.types";

interface AssigneeSelectProps {
  value: number | undefined;
  onChange: (id: number | undefined) => void;
  fetchItems: (search: string) => Promise<SearchableSelectOption[]>;
  queryKey: readonly unknown[];
  placeholder?: string;
  error?: FieldError;
}

export const AssigneeSelect = ({
  value,
  onChange,
  fetchItems,
  queryKey,
  placeholder,
  error,
}: AssigneeSelectProps) => {
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (value === undefined) setDisplayName("");
  }, [value]);

  return (
    <SearchableSelect
      value={displayName}
      onChange={setDisplayName}
      onSelect={(option) => {
        setDisplayName(option.name);
        onChange(option.id);
      }}
      onClear={() => {
        setDisplayName("");
        onChange(undefined);
      }}
      fetchItems={fetchItems}
      queryKey={queryKey}
      placeholder={placeholder}
      error={error}
    />
  );
};
