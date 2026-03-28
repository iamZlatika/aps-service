import { type ComponentProps, forwardRef } from "react";
import { type FieldError } from "react-hook-form";

import { Input } from "@/shared/components/ui/input.tsx";
import { cn } from "@/shared/lib/utils.ts";

interface FormFieldProps extends ComponentProps<typeof Input> {
  error?: FieldError;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <Input
        ref={ref}
        className={cn(className, error && "border-destructive")}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  ),
);

FormField.displayName = "FormField";

export { FormField };
