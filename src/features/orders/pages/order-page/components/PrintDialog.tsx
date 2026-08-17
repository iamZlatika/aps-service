import { Download, PrinterCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDocumentActions } from "@/features/orders/hooks/useDocumentActions.ts";
import { DocumentCheckboxRow } from "@/features/orders/pages/order-page/components/DocumentCheckboxRow.tsx";
import { RegenerateDocumentDialog } from "@/features/orders/pages/order-page/components/RegenerateDocumentDialog.tsx";
import type { OrderDocument } from "@/features/orders/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { DOCUMENTS_TYPES, type DocumentType } from "@/shared/types.ts";

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

  const documentsByType = useMemo(
    () => new Map(documents.map((d) => [d.type, d])),
    [documents],
  );

  // Documents appear in order over the order's lifecycle (intake -> payment
  // invoice -> closing), so the most recently produced one is the last
  // DOCUMENTS_TYPES entry that's present — that's the sensible default pick.
  const defaultCheckedType = useMemo(
    () => DOCUMENTS_TYPES.filter((type) => documentsByType.has(type)).at(-1),
    [documentsByType],
  );

  const [checked, setChecked] = useState<
    Partial<Record<DocumentType, boolean>>
  >({});

  useEffect(() => {
    if (!isOpen) return;
    setChecked(
      Object.fromEntries(
        DOCUMENTS_TYPES.map((type) => [type, type === defaultCheckedType]),
      ),
    );
  }, [isOpen, defaultCheckedType]);

  const selectedDocs = DOCUMENTS_TYPES.map((type) =>
    checked[type] ? documentsByType.get(type) : undefined,
  ).filter((d): d is OrderDocument => d != null);

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
          {DOCUMENTS_TYPES.map((type) => {
            const doc = documentsByType.get(type);
            if (!doc) return null;
            return (
              <DocumentCheckboxRow
                key={type}
                id={type}
                label={t(`orders.print.${type}`)}
                checked={!!checked[type]}
                onCheckedChange={(next) =>
                  setChecked((prev) => ({ ...prev, [type]: next }))
                }
                canManage={canManage}
                onRegenerate={() => setRegenerateType(type)}
              />
            );
          })}
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
