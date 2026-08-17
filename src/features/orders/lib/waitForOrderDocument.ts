import type { QueryClient } from "@tanstack/react-query";

import { type OrderDocument, type OrderInfo } from "@/features/orders/types";
import { queryKeys } from "@/shared/api/queryKeys";
import type { DocumentType } from "@/shared/types";

// Order documents (closing_receipt, payment_invoice) are generated
// asynchronously on the backend after a status change, and arrive later
// via the .order.document_added socket event. This waits for that event
// to land the document in the React Query cache, or times out.
export function waitForOrderDocument(
  queryClient: QueryClient,
  orderId: number,
  documentType: DocumentType,
  timeoutMs: number,
): Promise<OrderDocument | undefined> {
  return new Promise((resolve) => {
    const queryKey = queryKeys.orders.detail(orderId);

    const findDocument = (): OrderDocument | undefined =>
      queryClient
        .getQueryData<OrderInfo>(queryKey)
        ?.documents.find((d) => d.type === documentType);

    const existingDoc = findDocument();
    if (existingDoc) {
      resolve(existingDoc);
      return;
    }

    const timer = setTimeout(() => {
      unsubscribe();
      resolve(undefined);
    }, timeoutMs);

    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      const doc = findDocument();
      if (doc) {
        clearTimeout(timer);
        unsubscribe();
        resolve(doc);
      }
    });
  });
}
