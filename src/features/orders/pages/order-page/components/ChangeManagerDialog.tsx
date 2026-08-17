import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useChangeOrderManager } from "@/features/orders/hooks/useChangeOrderManager.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

interface ChangeManagerDialogProps {
  orderId: number;
  currentManagerId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangeManagerDialog = ({
  orderId,
  currentManagerId,
  isOpen,
  onOpenChange,
}: ChangeManagerDialogProps) => {
  const { t } = useTranslation();
  const [managerId, setManagerId] = useState(currentManagerId);

  const { users, isLoadingUsers, changeManager, isPending } =
    useChangeOrderManager(orderId, () => onOpenChange(false));

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) setManagerId(currentManagerId);
        onOpenChange(open);
      }}
    >
      <DialogContent onKeyDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{t("orders.changeManager.title")}</DialogTitle>
        </DialogHeader>

        <Select
          value={String(managerId)}
          onValueChange={(val) => setManagerId(Number(val))}
          disabled={!users.length || isLoadingUsers}
        >
          <SelectTrigger className="h-11 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {users.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("orders.print.cancel")}
          </Button>
          <Button
            disabled={isPending || managerId === currentManagerId}
            onClick={() => changeManager(managerId)}
          >
            {t("orders.changeManager.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
