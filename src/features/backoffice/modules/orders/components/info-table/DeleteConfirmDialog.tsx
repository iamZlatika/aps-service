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

interface DeleteConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

export const DeleteConfirmDialog = ({
  open,
  onConfirm,
  onCancel,
  title,
  description,
}: DeleteConfirmDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? t("common.deleteDialog.title")}</DialogTitle>
          <DialogDescription>
            {description ?? t("common.deleteDialog.description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("common.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
