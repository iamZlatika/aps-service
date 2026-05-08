import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";

type DocRef = { orderId: number; documentId: number };
type DownloadRef = DocRef & { filename: string };

type UseDocumentActionsReturn = {
  print: (docs: DocRef[]) => void;
  download: (docs: DownloadRef[]) => void;
  isPending: boolean;
};

async function mergeAndPrint(blobs: Blob[]): Promise<void> {
  const merged = await PDFDocument.create();
  for (const blob of blobs) {
    const bytes = await blob.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  const mergedBytes = await merged.save();
  const url = URL.createObjectURL(
    new Blob([mergedBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
  );

  await new Promise<void>((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;width:0;height:0;border:0";
    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onerror = () => {
      document.body.removeChild(iframe);
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load PDF for printing"));
    };

    iframe.onload = () => {
      if (!iframe.contentWindow) {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
        reject(new Error("contentWindow is null"));
        return;
      }
      window.addEventListener(
        "afterprint",
        () => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        },
        { once: true },
      );
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      resolve();
    };
  });
}

export function useDocumentActions(): UseDocumentActionsReturn {
  const printMutation = useMutation({
    mutationFn: async (docs: DocRef[]) => {
      const blobs = await Promise.all(
        docs.map(({ orderId, documentId }) =>
          ordersApi.fetchDocumentBlob(orderId, documentId),
        ),
      );
      await mergeAndPrint(blobs);
    },
    onError: () => {
      toast.error(i18next.t("orders.print.print_error"));
    },
  });

  const downloadMutation = useMutation({
    mutationFn: (docs: DownloadRef[]) =>
      Promise.all(
        docs.map(({ orderId, documentId, filename }) =>
          ordersApi.downloadDocument(orderId, documentId, filename),
        ),
      ),
  });

  return {
    print: (docs) => printMutation.mutate(docs),
    download: (docs) => downloadMutation.mutate(docs),
    isPending: printMutation.isPending || downloadMutation.isPending,
  };
}
