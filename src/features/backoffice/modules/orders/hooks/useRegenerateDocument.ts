import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { toast } from "sonner";

import { ordersApi } from "@/features/backoffice/modules/orders/api";
import type {
  OrderDocument,
  OrderInfo,
} from "@/features/backoffice/modules/orders/types";
import { queryKeys } from "@/shared/api/queryKeys";
import type { DocumentType } from "@/shared/types";

type UseRegenerateDocumentParams = {
  orderId: number;
  onSuccess: () => void;
};

type RegenerateDocumentInput = {
  type: DocumentType;
  notify: boolean;
};

type UseRegenerateDocumentReturn = {
  regenerate: (input: RegenerateDocumentInput) => void;
  isPending: boolean;
};

export function useRegenerateDocument({
  orderId,
  onSuccess,
}: UseRegenerateDocumentParams): UseRegenerateDocumentReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ type, notify }: RegenerateDocumentInput) =>
      ordersApi.regenerateDocument(orderId, type, notify),
    onSuccess: (document: OrderDocument) => {
      queryClient.setQueryData<OrderInfo>(
        queryKeys.orders.detail(orderId),
        (old) => {
          if (!old) return old;
          const idx = old.documents.findIndex((d) => d.type === document.type);
          const documents =
            idx === -1
              ? [...old.documents, document]
              : old.documents.map((d, i) => (i === idx ? document : d));
          return { ...old, documents };
        },
      );
      toast.success(i18next.t("orders.regenerateDocument.success"));
      onSuccess();
    },
  });

  return {
    regenerate: mutation.mutate,
    isPending: mutation.isPending,
  };
}
