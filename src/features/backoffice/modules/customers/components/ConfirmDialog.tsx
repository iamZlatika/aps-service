import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  buttonDescription: string;
}

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  buttonDescription,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>{t("customers.actions.cancel")}</Button>
          <Button variant="destructive" onClick={onConfirm}>
            {buttonDescription}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
