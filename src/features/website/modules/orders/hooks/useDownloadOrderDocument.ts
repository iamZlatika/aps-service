import { useMutation } from "@tanstack/react-query";

import { customerOrdersApi } from "@/features/website/modules/orders/api";

type DownloadDocumentArgs = {
  orderId: number;
  documentId: number;
  filename: string;
};

type UseDownloadOrderDocumentResult = {
  download: (args: DownloadDocumentArgs) => void;
  isPending: boolean;
};

function triggerBrowserDownload(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
}

export const useDownloadOrderDocument = (): UseDownloadOrderDocumentResult => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      orderId,
      documentId,
      filename,
    }: DownloadDocumentArgs) => {
      const blob = await customerOrdersApi.fetchDocumentBlob(
        orderId,
        documentId,
      );
      triggerBrowserDownload(blob, filename);
    },
  });

  return { download: mutate, isPending };
};
