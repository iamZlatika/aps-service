import { IMaskInput } from "react-imask";

import { cn } from "@/shared/lib/utils";

interface CardNumberMaskInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  disabled?: boolean;
}

export const CardNumberMaskInput = ({
  value,
  onChange,
  onBlur,
  placeholder,
  className,
  hasError,
  disabled,
}: CardNumberMaskInputProps) => (
  <IMaskInput
    mask="0000-0000-0000-0000"
    value={value}
    onAccept={(maskedValue: string) => {
      onChange(maskedValue.replace(/\D/g, ""));
    }}
    onBlur={onBlur}
    placeholder={placeholder ?? "XXXX-XXXX-XXXX-XXXX"}
    disabled={disabled}
    className={cn(
      "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      hasError && "border-destructive",
      className,
    )}
  />
);
