import { Check, Copy } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Label } from "@/shared/components/ui/label.tsx";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard.ts";

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
  copyable?: boolean;
}

export const DisplayField = ({ value, copyable = true }: DisplayFieldProps) => {
  const { t } = useTranslation();
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="h-11 rounded-md border border-input bg-muted px-3 text-base flex items-center justify-between gap-2">
      <span className="truncate min-w-0">
        {value || <span className="text-muted-foreground">—</span>}
      </span>
      {copyable && value && (
        <button
          type="button"
          onClick={() => copy(value)}
          aria-label={t("common.copy")}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
};
