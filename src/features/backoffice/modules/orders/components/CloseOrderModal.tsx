import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { useDocumentActions } from "@/features/backoffice/modules/orders/hooks/useDocumentActions.ts";
import Loader from "@/shared/components/common/Loader.tsx";
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
import {
  PAYMENT_METHODS,
  type PaymentMethodType,
  PAYMENTS,
} from "@/shared/types.ts";

interface CloseOrderModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
  statusId: number;
  remainingToPay: string;
  onSuccess?: () => void;
}

export const CloseOrderModal = ({
  open,
  onClose,
  orderId,
  statusId,
  remainingToPay,
  onSuccess,
}: CloseOrderModalProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { printAsync } = useDocumentActions();

  const [method, setMethod] = useState<PaymentMethodType>(PAYMENT_METHODS.CASH);

  const remaining = parseFloat(remainingToPay);
  const isOverpayment = remaining < 0;
  const displayAmount = parseFloat(Math.abs(remaining).toFixed(2)).toString();
  const hasBalance = remaining !== 0;

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
        const updated = await ordersApi.getOrder(orderId);
        const closingDoc = updated.documents.find(
          (d) => d.type === "closing_receipt",
        );
        if (closingDoc) {
          await printAsync([{ orderId, documentId: closingDoc.id }]);
        }
      }
    },
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent onEscapeKeyDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{t("orders.closeOrder")}</DialogTitle>
        </DialogHeader>

        {isPending ? (
          <Loader className="min-h-[160px]" />
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex items-baseline gap-2 text-lg">
              <span className="text-muted-foreground">
                {isOverpayment
                  ? t("orders.overpayment")
                  : t("orders.remainingToPay")}
                :
              </span>
              <span
                className={`font-semibold text-xl ${isOverpayment ? "text-destructive" : "text-green-500"}`}
              >
                {displayAmount} ₴
              </span>
            </div>

            {hasBalance && (
              <div className="flex flex-col gap-1.5">
                <Label>
                  {isOverpayment
                    ? t("orders.returnToClient")
                    : t("orders.takeFromClient")}
                </Label>
                <div className="flex gap-4 py-1">
                  {Object.values(PAYMENT_METHODS).map((m) => (
                    <label
                      key={m}
                      htmlFor={`close-method-${m}`}
                      className="flex cursor-pointer select-none items-center gap-1.5"
                    >
                      <Checkbox
                        id={`close-method-${m}`}
                        checked={method === m}
                        onCheckedChange={(checked) => {
                          if (checked) setMethod(m);
                        }}
                      />
                      <span className="text-sm">
                        {t(`orders.paymentMethods.${m}`)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={() => close(false)}
          >
            {t("orders.closeOrderOnly")}
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={() => close(true)}
          >
            {t("orders.closeAndPrint")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
