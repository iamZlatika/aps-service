import { Download, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useDownloadOrderDocument } from "@/features/website/modules/orders/hooks/useDownloadOrderDocument";
import { OrderSectionCard } from "@/features/website/modules/orders/pages/components/OrderSectionCard";
import { type OrderDocument } from "@/features/website/modules/orders/types";

interface OrderDocumentsListProps {
  orderId: number;
  documents: OrderDocument[];
}

const DOCUMENT_TYPE_LABEL_KEYS: Record<string, string> = {
  intake_receipt: "cabinet.docTypeIntakeReceipt",
  closing_receipt: "cabinet.docTypeClosingReceipt",
};

export const OrderDocumentsList = ({
  orderId,
  documents,
}: OrderDocumentsListProps) => {
  const { t } = useTranslation("website");
  const { download, isPending } = useDownloadOrderDocument();

  return (
    <OrderSectionCard
      icon={<FileText className="size-[17px]" aria-hidden="true" />}
      title={t("cabinet.documentsTitle")}
    >
      {documents.length === 0 ? (
        <p className="py-[22px] text-center text-[13px] text-ws-ink-mute">
          {t("cabinet.documentsEmpty")}
        </p>
      ) : (
        documents.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() =>
              download({ orderId, documentId: doc.id, filename: doc.name })
            }
            disabled={isPending}
            className="group flex w-full items-center gap-[13px] border-b border-ws-line-soft py-3.5 text-left last:border-b-0 disabled:opacity-55"
          >
            <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border border-[color-mix(in_oklab,var(--ws-ember)_22%,transparent)] bg-[color-mix(in_oklab,var(--ws-ember)_11%,transparent)] text-ws-ember-bright">
              <FileText className="size-[18px]" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold leading-[1.3] text-ws-ink">
                {t(
                  DOCUMENT_TYPE_LABEL_KEYS[doc.type] ?? "cabinet.docTypeOther",
                )}
              </span>
              <span className="mt-0.5 block truncate text-[12px] text-ws-ink-soft">
                {doc.name}
              </span>
            </span>
            <span className="shrink-0 text-ws-ink-mute transition-colors duration-150 group-hover:text-ws-ember-bright">
              <Download className="size-[18px]" aria-hidden="true" />
            </span>
          </button>
        ))
      )}
    </OrderSectionCard>
  );
};
