import { Search, X } from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

import { Input } from "@/shared/components/ui/input.tsx";

interface SearchFilterProps {
  fieldName: string;
  placeholder: string;
  value: string;
  onChange: (fieldName: string, value: string) => void;
  debounceMs?: number;
}

const SearchFilter = ({
  fieldName,
  placeholder,
  value,
  onChange,
  debounceMs = 400,
}: SearchFilterProps) => {
  const [localValue, setLocalValue] = useState(value);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestOnChange = useRef(onChange);

  useEffect(() => {
    latestOnChange.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setLocalValue(next);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      latestOnChange.current(fieldName, next);
    }, debounceMs);
  };

  const handleReset = () => {
    setLocalValue("");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    latestOnChange.current(fieldName, "");
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-sm mb-4">
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-9 pr-9 bg-background"
      />

      {localValue && (
        <button
          type="button"
          onClick={handleReset}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchFilter;
