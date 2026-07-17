import { useMutation } from "@tanstack/react-query";
import i18next from "i18next";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { useIsMobile } from "@/shared/hooks/useMobile";

const REVOKE_DELAY_MS = 60_000;

type DocRef = { orderId: number; documentId: number };
type DownloadRef = DocRef & { filename: string };

type UseDocumentActionsReturn = {
  print: (docs: DocRef[], title: string) => void;
  printAsync: (docs: DocRef[], title: string) => Promise<void>;
  download: (docs: DownloadRef[]) => void;
  isPending: boolean;
};

function openInNewTab(url: string): void {
  window.open(url, "_blank");
  window.setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
}

async function mergeAndPrint(
  blobs: Blob[],
  title: string,
  isMobile: boolean,
): Promise<void> {
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

  if (isMobile) {
    // Mobile browsers don't reliably support programmatic print() from a
    // hidden iframe (and some throw SecurityError accessing contentWindow),
    // so hand off to the browser's own PDF viewer, which has print/share controls.
    openInNewTab(url);
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;width:0;height:0;border:0";
    iframe.src = url;
    document.body.appendChild(iframe);

    const originalTitle = document.title;

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

      try {
        window.addEventListener(
          "afterprint",
          () => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(url);
            document.title = originalTitle;
          },
          { once: true },
        );
        document.title = title;
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        resolve();
      } catch {
        // Some browsers report as desktop-class but are restrictive
        // WebViews that block cross-frame access to a same-origin blob
        // iframe. Fall back to the same handoff used for mobile.
        document.body.removeChild(iframe);
        document.title = originalTitle;
        openInNewTab(url);
        resolve();
      }
    };
  });
}

export function useDocumentActions(): UseDocumentActionsReturn {
  const isMobile = useIsMobile();

  const printMutation = useMutation({
    mutationFn: async ({ docs, title }: { docs: DocRef[]; title: string }) => {
      const blobs = await Promise.all(
        docs.map(({ orderId, documentId }) =>
          ordersApi.fetchDocumentBlob(orderId, documentId),
        ),
      );
      await mergeAndPrint(blobs, title, isMobile);
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
    print: (docs, title) => printMutation.mutate({ docs, title }),
    printAsync: (docs, title) => printMutation.mutateAsync({ docs, title }),
    download: (docs) => downloadMutation.mutate(docs),
    isPending: printMutation.isPending || downloadMutation.isPending,
  };
}
