import { CreditCard, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { OrderSectionCard } from "@/features/website/modules/orders/pages/components/OrderSectionCard";
import { type TrackPayment } from "@/features/website/types";
import { formatDate } from "@/shared/lib/utils";

interface OrderPaymentsCardProps {
  payments: TrackPayment[];
  estimatedCost: string | null;
  totalPaid: string;
  remainingToPay: string;
}

export const OrderPaymentsCard = ({
  payments,
  estimatedCost,
  totalPaid,
  remainingToPay,
}: OrderPaymentsCardProps) => {
  const { t } = useTranslation("website");

  return (
    <OrderSectionCard
      icon={<CreditCard className="size-[17px]" aria-hidden="true" />}
      title={t("cabinet.paymentsTitle")}
    >
      {payments.length === 0 ? (
        <p className="py-[22px] text-center text-[13px] text-ws-ink-mute">
          {t("cabinet.paymentsEmpty")}
        </p>
      ) : (
        payments.map((payment, index) => {
          const isRefund = payment.type === "refund";

          return (
            <div
              key={index}
              className="flex items-center gap-3.5 border-b border-ws-line-soft py-3.5 last:border-b-0"
            >
              <span
                className={
                  isRefund
                    ? "flex size-[34px] shrink-0 items-center justify-center rounded-[9px] bg-ws-red/12 text-ws-red-bright"
                    : "flex size-[34px] shrink-0 items-center justify-center rounded-[9px] bg-ws-green/12 text-ws-green-soft"
                }
              >
                <Plus className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-semibold text-ws-ink">
                  {t(`track.history.payment.${payment.type}`)}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ws-ink-soft">
                  <CreditCard className="size-[13px]" aria-hidden="true" />
                  {t(`track.history.payment.method.${payment.method}`)} ·{" "}
                  {formatDate(payment.createdAt)}
                </span>
              </span>
              <span
                className={
                  isRefund
                    ? "whitespace-nowrap text-[15px] font-bold tabular-nums text-ws-red-bright"
                    : "whitespace-nowrap text-[15px] font-bold tabular-nums text-ws-green-bright"
                }
              >
                {isRefund ? "−" : "+"}
                {payment.amount} ₴
              </span>
            </div>
          );
        })
      )}

      <div className="mt-1 border-t border-ws-line-soft pt-1">
        <div className="flex items-center justify-between py-[9px] text-[13.5px] text-ws-ink-soft">
          <span>{t("cabinet.estimatedCost")}</span>
          <span className="font-semibold tabular-nums text-ws-ink">
            {estimatedCost ? `${estimatedCost} ₴` : t("track.cost.pending")}
          </span>
        </div>
        <div className="flex items-center justify-between py-[9px] text-[13.5px] text-ws-ink-soft">
          <span>{t("cabinet.orderTotalPaid")}</span>
          <span className="font-semibold tabular-nums text-ws-green-bright">
            {totalPaid} ₴
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-ws-line-soft pt-[14px] text-[15px] font-semibold text-ws-ink">
          <span>{t("cabinet.orderRemainingToPay")}</span>
          <span className="text-[18px] font-bold tabular-nums text-ws-ember-bright">
            {remainingToPay} ₴
          </span>
        </div>
      </div>
    </OrderSectionCard>
  );
};
