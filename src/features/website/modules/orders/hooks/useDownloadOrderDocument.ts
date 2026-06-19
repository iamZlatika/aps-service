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

export const useDownloadOrderDocument = (): UseDownloadOrderDocumentResult => {
  const { mutate, isPending } = useMutation({
    mutationFn: ({ orderId, documentId, filename }: DownloadDocumentArgs) =>
      customerOrdersApi.downloadDocument(orderId, documentId, filename),
  });

  return { download: mutate, isPending };
};
