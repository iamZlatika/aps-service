import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { ordersApi } from "@/features/orders/api";
import { useDocumentActions } from "@/features/orders/hooks/useDocumentActions";
import { waitForOrderDocument } from "@/features/orders/lib/waitForOrderDocument";
import {
  PAYMENT_METHODS,
  type PaymentMethodType,
  PAYMENTS,
} from "@/shared/types";

const CLOSING_RECEIPT_WAIT_MS = 15_000;

type UseCloseOrderParams = {
  orderId: number;
  statusId: number;
  remainingToPay: string;
  onSuccess?: () => void;
  onClose: () => void;
};

type UseCloseOrderReturn = {
  close: (withPrint: boolean) => void;
  isPending: boolean;
  method: PaymentMethodType;
  setMethod: (method: PaymentMethodType) => void;
  isOverpayment: boolean;
  hasBalance: boolean;
  displayAmount: string;
};

export function useCloseOrder({
  orderId,
  statusId,
  remainingToPay,
  onSuccess,
  onClose,
}: UseCloseOrderParams): UseCloseOrderReturn {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { printAsync } = useDocumentActions();
  const queryClient = useQueryClient();

  const [method, setMethod] = useState<PaymentMethodType>(PAYMENT_METHODS.CASH);

  const remaining = parseFloat(remainingToPay);
  const isOverpayment = remaining < 0;
  const hasBalance = remaining !== 0;
  const displayAmount = parseFloat(Math.abs(remaining).toFixed(2)).toString();

  const { mutate: close, isPending } = useMutation({
    mutationFn: async (withPrint: boolean) => {
      if (hasBalance && user) {
        await ordersApi.makePayment(orderId, {
          type: isOverpayment ? PAYMENTS.REFUND : PAYMENTS.PAYMENT,
          method,
          amount: String(Math.abs(remaining)),
          note: isOverpayment
            ? t("orders.refundNoteOnClose")
            : t("orders.paymentNoteOnClose"),
          managerId: user.id,
        });
      }

      await ordersApi.changeStatus(orderId, statusId);

      if (withPrint) {
        const closingDoc = await waitForOrderDocument(
          queryClient,
          orderId,
          "closing_receipt",
          CLOSING_RECEIPT_WAIT_MS,
        );
        if (closingDoc) {
          await printAsync(
            [{ orderId, documentId: closingDoc.id }],
            closingDoc.name,
          );
        } else {
          toast.error(t("orders.print.print_document_timeout"));
        }
      }
    },
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  return {
    close,
    isPending,
    method,
    setMethod,
    isOverpayment,
    hasBalance,
    displayAmount,
  };
}
