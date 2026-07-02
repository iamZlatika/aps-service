import {
  type Control,
  Controller,
  type FieldError,
  type UseFormRegister,
} from "react-hook-form";

import { BILLING_DIRECTIONS } from "@/features/backoffice/modules/billing/lib/constants.ts";
import { type AdjustBalanceFormValues } from "@/features/backoffice/modules/billing/lib/schema.ts";
import { Label } from "@/shared/components/ui/label.tsx";
import { cn } from "@/shared/lib/utils.ts";

interface SignedAmountInputProps {
  control: Control<AdjustBalanceFormValues>;
  register: UseFormRegister<AdjustBalanceFormValues>;
  label: string;
  error?: FieldError;
}

export const SignedAmountInput = ({
  control,
  register,
  label,
  error,
}: SignedAmountInputProps) => (
  <div className="flex flex-col gap-1">
    <Label htmlFor="amount">{label}</Label>
    <Controller
      name="direction"
      control={control}
      render={({ field: directionField }) => (
        <div
          className={cn(
            "flex h-11 w-full rounded-md border border-input shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring",
            error && "border-destructive",
          )}
        >
          <span className="flex items-center px-3 border-r border-input bg-muted text-base rounded-l-md select-none">
            {directionField.value === BILLING_DIRECTIONS.DEDUCT ? "−" : "+"}
          </span>
          <input
            id="amount"
            {...register("amount")}
            inputMode="decimal"
            className="flex-1 bg-transparent px-3 py-1 text-base placeholder:text-muted-foreground focus:outline-none rounded-r-md"
          />
        </div>
      )}
    />
    {error && <p className="text-sm text-destructive">{error.message}</p>}
  </div>
);
