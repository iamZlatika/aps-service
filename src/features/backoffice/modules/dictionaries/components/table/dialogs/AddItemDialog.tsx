import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { DialogDescription } from "@radix-ui/react-dialog";

interface AddItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  placeholder: string;
  cancelLabel: string;
  confirmLabel: string;
  onConfirm: (name: string) => void;
  isPending: boolean;
  value: string;
  onValueChange: (value: string) => void;
}

export const AddItemDialog = ({
  isOpen,
  onOpenChange,
  title,
  placeholder,
  cancelLabel,
  confirmLabel,
  onConfirm,
  isPending,
  value,
  onValueChange,
}: AddItemDialogProps) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Форма добавления нового элемента
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleConfirm();
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleConfirm}
            disabled={isPending || !value.trim()}
          >
            {isPending ? t("loader.default") : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
