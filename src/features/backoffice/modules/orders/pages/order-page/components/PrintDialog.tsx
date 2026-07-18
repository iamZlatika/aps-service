import { Download, PrinterCheck, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDocumentActions } from "@/features/backoffice/modules/orders/hooks/useDocumentActions.ts";
import { RegenerateDocumentDialog } from "@/features/backoffice/modules/orders/pages/order-page/components/RegenerateDocumentDialog.tsx";
import type { OrderDocument } from "@/features/backoffice/modules/orders/types.ts";
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

interface PrintDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  documents: OrderDocument[];
  canManage: boolean;
}

export const PrintDialog = ({
  isOpen,
  onOpenChange,
  orderId,
  documents,
  canManage,
}: PrintDialogProps) => {
  const { t } = useTranslation();
  const { print, download, isPending } = useDocumentActions();
  const [regenerateType, setRegenerateType] = useState<DocumentType | null>(
    null,
  );

  const intakeDoc = documents.find((d) => d.type === "intake_receipt");
  const closingDoc = documents.find((d) => d.type === "closing_receipt");

  const hasClosingDoc = !!closingDoc;

  const [intakeChecked, setIntakeChecked] = useState(!hasClosingDoc);
  const [closingChecked, setClosingChecked] = useState(hasClosingDoc);

  useEffect(() => {
    if (!isOpen) return;
    setIntakeChecked(!hasClosingDoc);
    setClosingChecked(hasClosingDoc);
  }, [isOpen, hasClosingDoc]);

  const selectedDocs = [
    intakeChecked && intakeDoc ? intakeDoc : null,
    closingChecked && closingDoc ? closingDoc : null,
  ].filter((d): d is OrderDocument => d !== null);

  const canAct = selectedDocs.length > 0 && !isPending;

  const handlePrint = () => {
    const title = selectedDocs.map((doc) => doc.name).join(", ");
    print(
      selectedDocs.map((doc) => ({ orderId, documentId: doc.id })),
      title,
    );
  };

  const handleDownload = () => {
    download(
      selectedDocs.map((doc) => ({
        orderId,
        documentId: doc.id,
        filename: doc.name,
      })),
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent onKeyDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{t("orders.print.title")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          {intakeDoc && (
            <div className="flex items-center gap-3">
              <Checkbox
                id="intake"
                checked={intakeChecked}
                onCheckedChange={(checked) => setIntakeChecked(!!checked)}
              />
              <Label htmlFor="intake" className="flex-1">
                {t("orders.print.intake_receipt")}
              </Label>
              {canManage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title={t("orders.regenerateDocument.action")}
                  onClick={() => setRegenerateType("intake_receipt")}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {closingDoc && (
            <div className="flex items-center gap-3">
              <Checkbox
                id="closing"
                checked={closingChecked}
                onCheckedChange={(checked) => setClosingChecked(!!checked)}
              />
              <Label htmlFor="closing" className="flex-1">
                {t("orders.print.closing_receipt")}
              </Label>
              {canManage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title={t("orders.regenerateDocument.action")}
                  onClick={() => setRegenerateType("closing_receipt")}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("orders.print.cancel")}
          </Button>
          <Button variant="outline" disabled={!canAct} onClick={handleDownload}>
            <Download className="h-4 w-4" />
            {t("orders.print.download")}
          </Button>
          <Button disabled={!canAct} onClick={handlePrint}>
            <PrinterCheck className="h-4 w-4" />
            {t("orders.print.print")}
          </Button>
        </DialogFooter>
      </DialogContent>

      <RegenerateDocumentDialog
        orderId={orderId}
        type={regenerateType}
        onOpenChange={(open) => !open && setRegenerateType(null)}
      />
    </Dialog>
  );
};
