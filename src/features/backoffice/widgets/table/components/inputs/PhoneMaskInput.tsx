import { IMaskInput } from "react-imask";

import { cn } from "@/shared/lib/utils";

interface PhoneMaskInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
}

export const PhoneMaskInput = ({
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  placeholder,
  className,
  hasError,
}: PhoneMaskInputProps) => {
  const displayValue = value.startsWith("+38")
    ? value.slice(3)
    : value.startsWith("38")
      ? value.slice(2)
      : value;

  return (
    <div
      className={cn(
        "flex h-11 w-full rounded-md border border-input shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring",
        hasError && "border-destructive",
        className,
      )}
    >
      <span className="flex items-center px-3 border-r border-input bg-muted text-base rounded-l-md select-none">
        +38
      </span>
      <IMaskInput
        mask="000-000-00-00"
        value={displayValue}
        onAccept={(maskedValue: string) => {
          const digits = maskedValue.replace(/\D/g, "");
          onChange(digits ? "+38" + digits : "");
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder ?? "0__-___-__-__"}
        className="flex-1 bg-transparent px-3 py-1 text-base placeholder:text-muted-foreground focus:outline-none rounded-r-md"
      />
    </div>
  );
};
