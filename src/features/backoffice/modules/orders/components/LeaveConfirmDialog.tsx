import { useTranslation } from "react-i18next";
import type { Blocker } from "react-router-dom";

import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";

interface LeaveConfirmDialogProps {
  blocker: Blocker;
}

export const LeaveConfirmDialog = ({ blocker }: LeaveConfirmDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={blocker.state === "blocked"}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t("orders.leaveGuard.title")}</DialogTitle>
          <DialogDescription>
            {t("orders.leaveGuard.description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => blocker.reset?.()}>
            {t("orders.leaveGuard.stay")}
          </Button>
          <Button variant="destructive" onClick={() => blocker.proceed?.()}>
            {t("orders.leaveGuard.leave")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
