import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button.tsx";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

interface DocumentCheckboxRowProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  canManage: boolean;
  onRegenerate: () => void;
}

export const DocumentCheckboxRow = ({
  id,
  label,
  checked,
  onCheckedChange,
  canManage,
  onRegenerate,
}: DocumentCheckboxRowProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(next) => onCheckedChange(!!next)}
      />
      <Label htmlFor={id} className="flex-1">
        {label}
      </Label>
      {canManage && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title={t("orders.regenerateDocument.action")}
          onClick={onRegenerate}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
