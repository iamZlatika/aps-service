import { IMaskInput } from "react-imask";

import { cn } from "@/shared/lib/utils";

interface PhoneMaskInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const PhoneMaskInput = ({
  value,
  onChange,
  className,
}: PhoneMaskInputProps) => {
  const displayValue = value.startsWith("38") ? value.slice(2) : value;

  return (
    <div
      className={cn(
        "flex h-9 w-full rounded-md border border-input shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring",
        className,
      )}
    >
      <span className="flex items-center px-3 border-r border-input bg-muted text-sm rounded-l-md select-none">
        +38
      </span>
      <IMaskInput
        mask="000-000-00-00"
        value={displayValue}
        onAccept={(maskedValue: string) => {
          const digits = maskedValue.replace(/\D/g, "");
          onChange(digits ? "38" + digits : "");
        }}
        placeholder="0XX-XXX-XX-XX"
        className="flex-1 bg-transparent px-3 py-1 text-sm placeholder:text-muted-foreground focus:outline-none rounded-r-md"
      />
    </div>
  );
};
