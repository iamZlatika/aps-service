import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useChangeOrderManager } from "@/features/orders/hooks/useChangeOrderManager.ts";
import type { User } from "@/features/users/types.ts";
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
  currentManager: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangeManagerDialog = ({
  orderId,
  currentManager,
  isOpen,
  onOpenChange,
}: ChangeManagerDialogProps) => {
  const { t } = useTranslation();
  const [managerId, setManagerId] = useState(currentManager.id);

  const { users, isLoadingUsers, changeManager, isPending } =
    useChangeOrderManager(orderId, () => onOpenChange(false));

  // The active-managers list may not include the order's current manager
  // (e.g. they were blocked after being assigned) — keep them selectable
  // so the Select doesn't render blank for a still-valid current value.
  const options = useMemo(
    () =>
      users.some((u) => u.id === currentManager.id)
        ? users
        : [currentManager, ...users],
    [users, currentManager],
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) setManagerId(currentManager.id);
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
          disabled={!options.length || isLoadingUsers}
        >
          <SelectTrigger className="h-11 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((u) => (
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
            disabled={isPending || managerId === currentManager.id}
            onClick={() => changeManager(managerId)}
          >
            {t("orders.changeManager.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
