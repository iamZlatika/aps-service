import { AlertTriangle, ChevronLeft, Package, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { WebsiteLoader } from "@/features/website/components/Loader";
import { StatusBadge } from "@/features/website/components/StatusBadge";
import { CUSTOMER_ACCOUNT_LINKS } from "@/features/website/modules/account/navigation";
import { useCustomerOrder } from "@/features/website/modules/orders/hooks/useCustomerOrder";
import { OrderDeviceInfo } from "@/features/website/modules/orders/pages/components/OrderDeviceInfo";
import { OrderDocumentsList } from "@/features/website/modules/orders/pages/components/OrderDocumentsList";
import { OrderLineItemsCard } from "@/features/website/modules/orders/pages/components/OrderLineItemsCard";
import { OrderPaymentsCard } from "@/features/website/modules/orders/pages/components/OrderPaymentsCard";
import { NotFoundPage } from "@/features/website/pages/not-found";
import { QueryPageGuard } from "@/shared/components/errors/QueryPageGuard";

interface OrderDetailPageContentProps {
  orderId: number;
}

const OrderDetailPageContent = ({ orderId }: OrderDetailPageContentProps) => {
  const { order, isLoading, isError, error, refetch } =
    useCustomerOrder(orderId);
  const { t } = useTranslation("website");

  return (
    <QueryPageGuard
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={refetch}
      buttonClassName="bg-[var(--ws-bg-2)] text-[var(--ws-ink)] border-[var(--ws-line)] hover:bg-[var(--ws-bg-3)]"
      loadingFallback={
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ws-bg">
          <WebsiteLoader />
        </div>
      }
    >
      {order && (
        <div className="ws-wrap">
          <section className="pb-20 pt-12 max-sm:pt-8">
            <Link
              to={CUSTOMER_ACCOUNT_LINKS.root()}
              className="mb-[18px] inline-flex items-center gap-2 border-0 bg-transparent p-0 font-[inherit] text-ws-base font-semibold text-ws-ink-soft no-underline transition-colors duration-150 hover:text-ws-ember-bright"
            >
              <ChevronLeft className="size-[15px]" aria-hidden="true" />
              {t("cabinet.backToOrdersList")}
            </Link>

            <p className="mb-[10px] text-[11px] font-semibold uppercase tracking-[.16em] text-ws-ink-mute">
              {t("track.eyebrow")}
            </p>

            <div className="mb-6 flex flex-wrap items-center gap-3.5">
              <h1 className="text-[clamp(24px,2.6vw,34px)] font-light tabular-nums leading-[1.1] tracking-[-0.015em] text-ws-ink">
                {order.orderNumber}
              </h1>
              <StatusBadge status={order.status} />
              {order.isUrgent && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ws-red/28 bg-ws-red/10 px-3 py-1 text-[12px] font-semibold text-ws-red-bright">
                  <AlertTriangle className="size-[13px]" aria-hidden="true" />
                  {t("cabinet.orderUrgent")}
                </span>
              )}
            </div>

            <div className="grid grid-cols-[1fr_320px] items-start gap-[18px] max-[900px]:grid-cols-1">
              <div className="flex min-w-0 flex-col gap-[18px]">
                <OrderDeviceInfo order={order} />

                <OrderLineItemsCard
                  icon={<Wrench className="size-[17px]" aria-hidden="true" />}
                  title={t("cabinet.servicesTitle")}
                  items={order.services}
                  emptyText={t("cabinet.servicesEmpty")}
                />

                <OrderLineItemsCard
                  icon={<Package className="size-[17px]" aria-hidden="true" />}
                  title={t("cabinet.productsTitle")}
                  items={order.products}
                  emptyText={t("cabinet.productsEmpty")}
                />
              </div>

              <div className="flex min-w-0 flex-col gap-[18px]">
                <OrderDocumentsList
                  orderId={order.id}
                  documents={order.documents}
                />

                <OrderPaymentsCard
                  payments={order.payments}
                  totalCost={order.totalCost}
                  totalPaid={order.totalPaid}
                  remainingToPay={order.remainingToPay}
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </QueryPageGuard>
  );
};

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : NaN;

  if (!Number.isFinite(orderId)) {
    return <NotFoundPage />;
  }

  return <OrderDetailPageContent orderId={orderId} />;
};

export default OrderDetailPage;
