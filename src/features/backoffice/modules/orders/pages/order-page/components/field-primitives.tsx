import type { ReactNode } from "react";

import { Label } from "@/shared/components/ui/label.tsx";

interface LabeledFieldProps {
  htmlFor?: string;
  label: string;
  children: ReactNode;
}

export const LabeledField = ({
  htmlFor,
  label,
  children,
}: LabeledFieldProps) => (
  <div className="flex flex-col gap-1">
    <Label
      className="text-xs text-muted-foreground font-normal"
      htmlFor={htmlFor}
    >
      {label}
    </Label>
    {children}
  </div>
);

interface DisplayFieldProps {
  value?: string | null;
}

export const DisplayField = ({ value }: DisplayFieldProps) => (
  <div className="h-11 rounded-md border border-input bg-muted px-3 text-base flex items-center">
    {value || <span className="text-muted-foreground">—</span>}
  </div>
);
