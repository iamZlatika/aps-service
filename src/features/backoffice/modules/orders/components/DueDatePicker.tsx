import { addDays, format, isBefore, parse, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FieldError } from "react-hook-form";

import { Calendar } from "@/shared/components/ui/calendar";
import { cn } from "@/shared/lib/utils";

interface DueDatePickerProps {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: FieldError;
}

const parseStoredDate = (value: string): Date =>
  parse(value, "yyyy-MM-dd", new Date());

export const DueDatePicker = ({
  value,
  onChange,
  placeholder,
  error,
}: DueDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = startOfDay(new Date());
  const suggested = addDays(today, 5);

  const selected = value ? parseStoredDate(value) : undefined;

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

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    onChange(format(date, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
          !value && "text-muted-foreground",
          error && "border-destructive",
        )}
      >
        <CalendarIcon size={16} className="shrink-0 text-muted-foreground" />
        {value ? format(parseStoredDate(value), "dd.MM.yyyy") : placeholder}
      </button>
      {isOpen && (
        <div className="absolute bottom-full z-50 mb-1 rounded-md border bg-popover shadow-md">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            disabled={(date) => isBefore(startOfDay(date), today)}
            modifiers={{ suggested: [suggested] }}
            modifiersClassNames={{
              suggested: "ring-1 ring-primary ring-inset rounded-md",
            }}
            defaultMonth={selected ?? suggested}
          />
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
};
