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

type PasswordChangedDialogProps = {
  open: boolean;
  onClose: () => void;
};

const PasswordChangedDialog = ({
  open,
  onClose,
}: PasswordChangedDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("profile.password_changed_success")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("profile.password_changed_success")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>{t("profile.ok")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChangedDialog;
