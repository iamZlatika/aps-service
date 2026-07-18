import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useRegenerateDocument } from "@/features/backoffice/modules/orders/hooks/useRegenerateDocument.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import type { DocumentType } from "@/shared/types.ts";

interface RegenerateDocumentDialogProps {
  orderId: number;
  type: DocumentType | null;
  onOpenChange: (open: boolean) => void;
}

export const RegenerateDocumentDialog = ({
  orderId,
  type,
  onOpenChange,
}: RegenerateDocumentDialogProps) => {
  const { t } = useTranslation();
  const [notify, setNotify] = useState(false);

  const { regenerate, isPending } = useRegenerateDocument({
    orderId,
    onSuccess: () => onOpenChange(false),
  });

  const handleConfirm = () => {
    if (!type) return;
    regenerate({ type, notify });
  };

  return (
    <Dialog
      open={type !== null}
      onOpenChange={(open) => {
        if (!open) setNotify(false);
        onOpenChange(open);
      }}
    >
      <DialogContent onKeyDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>
            {type &&
              t("orders.regenerateDocument.title", {
                document: t(`orders.print.${type}`),
              })}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 py-2">
          <Checkbox
            id="regenerate-notify"
            checked={notify}
            onCheckedChange={(checked) => setNotify(!!checked)}
          />
          <Label htmlFor="regenerate-notify">
            {t("orders.regenerateDocument.notifyLabel")}
          </Label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("orders.print.cancel")}
          </Button>
          <Button disabled={isPending} onClick={handleConfirm}>
            {t("orders.regenerateDocument.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
