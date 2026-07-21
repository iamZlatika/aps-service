import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";

interface EditConflictDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const EditConflictDialog = ({
  isOpen,
  onConfirm,
  onCancel,
}: EditConflictDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t("orders.editConflict.title")}</DialogTitle>
          <DialogDescription>
            {t("orders.editConflict.description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {t("orders.editConflict.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("orders.editConflict.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
