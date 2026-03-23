import { useTranslation } from "react-i18next";

import { type BaseItem } from "@/shared/components/table/types.ts";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { DialogFooter, DialogHeader } from "@/shared/components/ui/dialog.tsx";
import { Input } from "@/shared/components/ui/input.tsx";

export interface FieldConfig {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

interface EditItemDialogProps<T extends BaseItem> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: FieldConfig[];
  values: Partial<T>;
  onValuesChange: (values: Partial<T>) => void;
  onConfirm: (values: Partial<T>) => void;
  isPending: boolean;
  cancelLabel: string;
  confirmLabel: string;
}

export const EditItemDialog = <T extends BaseItem>({
  isOpen,
  onOpenChange,
  title,
  fields,
  values,
  onValuesChange,
  onConfirm,
  isPending,
  cancelLabel,
  confirmLabel,
}: EditItemDialogProps<T>) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4 flex flex-col gap-3">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="text-sm font-medium">{field.label}</label>
              <Input
                placeholder={field.placeholder}
                value={String(values[field.key as keyof T] ?? "")}
                onChange={(e) =>
                  onValuesChange({ ...values, [field.key]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? t("loader.default") : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
