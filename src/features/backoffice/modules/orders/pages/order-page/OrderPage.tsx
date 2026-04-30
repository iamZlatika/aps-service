import { format } from "date-fns";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { StatusSelect } from "@/features/backoffice/modules/orders/components/StatusSelect.tsx";
import { useOrder } from "@/features/backoffice/modules/orders/hooks/useOrder.ts";
import { HistorySidebar } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/HistorySidebar.tsx";
import { PaymentsCard } from "@/features/backoffice/modules/orders/pages/order-page/components/PaymentsCard.tsx";
import { ProductsAndServicesCard } from "@/features/backoffice/modules/orders/pages/order-page/components/ProductsAndServicesCard.tsx";
import { buildOrderHistory } from "@/features/backoffice/modules/orders/pages/order-page/services.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import Loader from "@/shared/components/common/Loader.tsx";
import NotFoundPage from "@/shared/components/errors/NotFound.tsx";
import { QueryPageGuard } from "@/shared/components/errors/QueryPageGuard.tsx";

interface OrderPageContentProps {
  orderId: number;
}

const OrderPageContent = ({ orderId }: OrderPageContentProps) => {
  const { t } = useTranslation();
  const { selectedOrder, isLoading, isError, error, refetch } =
    useOrder(orderId);

  const history = useMemo(
    () => (selectedOrder ? buildOrderHistory(selectedOrder) : []),
    [selectedOrder],
  );

  const handleStatusSuccess = useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(orderId),
      }),
    [orderId],
  );

  return (
    <QueryPageGuard
      isLoading={isLoading}
      loadingFallback={<Loader />}
      isError={isError}
      error={error}
      onRetry={refetch}
    >
      {selectedOrder && (
        <div className="flex h-full">
          <div className="flex-1 overflow-y-auto p-2 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">
                  {t("orders.order")} {selectedOrder.orderNumber}
                </h1>
                <StatusSelect
                  orderId={orderId}
                  status={selectedOrder.status}
                  onSuccess={handleStatusSuccess}
                />
                <span className="text-muted-foreground text-2xl">
                  {t("orders.remainingToPay")}:{" "}
                  <span className="font-medium text-2xl">
                    {selectedOrder.remainingToPay} ₴
                  </span>
                </span>
              </div>
              <div className="mt-1">
                <p className="text-muted-foreground text-base font-medium">
                  {t("orders.acceptedBy")}: {selectedOrder.manager.name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {selectedOrder.closedAt
                    ? `${t("orders.createdAt")}: ${format(new Date(selectedOrder.createdAt), "dd.MM.yyyy")} — ${t("orders.closedAt")}: ${format(new Date(selectedOrder.closedAt), "dd.MM.yyyy")}`
                    : `${t("orders.createdAt")}: ${format(new Date(selectedOrder.createdAt), "dd.MM.yyyy")}`}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <ProductsAndServicesCard
                orderId={orderId}
                selectedOrder={selectedOrder}
              />
              <PaymentsCard orderId={orderId} selectedOrder={selectedOrder} />
            </div>
          </div>
          <HistorySidebar orderId={selectedOrder.id} history={history} />
        </div>
      )}
    </QueryPageGuard>
  );
};

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id!, 10);

  if (!Number.isFinite(orderId)) {
    return <NotFoundPage />;
  }

  return <OrderPageContent orderId={orderId} />;
};

export default OrderPage;
