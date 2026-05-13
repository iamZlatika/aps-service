import { format } from "date-fns";
import { Printer, Users } from "lucide-react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { AuthRoutes } from "@/features/auth/api/routes.ts";
import { CustomerInfoCard } from "@/features/backoffice/modules/customers/components/CustomerInfoCard.tsx";
import { StatusSelect } from "@/features/backoffice/modules/orders/components/StatusSelect.tsx";
import { useOrder } from "@/features/backoffice/modules/orders/hooks/useOrder.ts";
import { HistorySidebar } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/HistorySidebar.tsx";
import { PaymentsCard } from "@/features/backoffice/modules/orders/pages/order-page/components/PaymentsCard.tsx";
import { ProductsAndServicesCard } from "@/features/backoffice/modules/orders/pages/order-page/components/ProductsAndServicesCard.tsx";
import { buildOrderHistory } from "@/features/backoffice/modules/orders/pages/order-page/services.ts";
import { ORDERS_ROUTES } from "@/features/backoffice/modules/orders/routes.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import Loader from "@/shared/components/common/Loader.tsx";
import NotFoundPage from "@/shared/components/errors/NotFound.tsx";
import { QueryPageGuard } from "@/shared/components/errors/QueryPageGuard.tsx";
import { cn } from "@/shared/lib/utils.ts";

import { FinanceTab } from "./components/FinanceTab.tsx";
import { OrderInfoCard } from "./components/order-info-fields/OrderInfoCard.tsx";

const PrintDialog = lazy(() =>
  import("./components/PrintDialog.tsx").then((m) => ({
    default: m.PrintDialog,
  })),
);

type OrderTab = "order" | "finance";

interface OrderPageContentProps {
  orderId: number;
}

const OrderPageContent = ({ orderId }: OrderPageContentProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedOrder, isLoading, isError, error, refetch } =
    useOrder(orderId);

  useEffect(() => {
    const root = AuthRoutes.backofficeRoot();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate(`${root}/${ORDERS_ROUTES.root}`);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<OrderTab>("order");

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
        <>
          <div className="flex h-full">
            <div className="flex-1 overflow-y-auto p-2 sm:p-6">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">
                      {t("orders.order")} {selectedOrder.orderNumber}
                    </h1>
                    <StatusSelect
                      orderId={orderId}
                      status={selectedOrder.status}
                      remainingToPay={selectedOrder.remainingToPay}
                      onSuccess={handleStatusSuccess}
                    />
                    <span className="text-muted-foreground text-2xl">
                      {parseFloat(selectedOrder.remainingToPay) < 0
                        ? t("orders.overpayment")
                        : t("orders.remainingToPay")}
                      :{" "}
                      <span
                        className={`font-medium text-2xl ${parseFloat(selectedOrder.remainingToPay) < 0 ? "text-destructive" : "text-green-500"}`}
                      >
                        {selectedOrder.remainingToPay} ₴
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="h-12 w-12 flex items-center justify-center rounded-md border bg-card text-muted-foreground hover:text-foreground shadow-sm transition-colors"
                      onClick={() =>
                        navigate(
                          `${AuthRoutes.backofficeRoot()}/${ORDERS_ROUTES.createNewOrder}`,
                          { state: { customer: selectedOrder.customer } },
                        )
                      }
                    >
                      <Users className="h-5 w-5" />
                    </button>
                    <button
                      className="h-12 w-12 flex items-center justify-center rounded-md border bg-card text-muted-foreground hover:text-foreground shadow-sm transition-colors"
                      onClick={() => setIsPrintOpen(true)}
                    >
                      <Printer className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-1 flex items-end justify-between">
                  <div>
                    <p className="text-muted-foreground text-base font-medium">
                      {t("orders.acceptedBy")}: {selectedOrder.manager.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {selectedOrder.closedAt
                        ? `${t("orders.createdAt")}: ${format(new Date(selectedOrder.createdAt), "dd.MM.yyyy")} — ${t("orders.closedAt")}: ${format(new Date(selectedOrder.closedAt), "dd.MM.yyyy")}`
                        : `${t("orders.createdAt")}: ${format(new Date(selectedOrder.createdAt), "dd.MM.yyyy")}`}
                    </p>
                  </div>
                  <div className="flex gap-5">
                    {(["order", "finance"] as OrderTab[]).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "pb-2 text-sm whitespace-nowrap transition-colors focus:outline-none border-b-2",
                          activeTab === tab
                            ? "text-foreground font-medium border-primary"
                            : "text-muted-foreground hover:text-foreground border-transparent",
                        )}
                      >
                        {t(`orders.tabs.${tab}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {activeTab === "order" && (
                <div className="flex flex-col gap-6 mt-6">
                  <ProductsAndServicesCard
                    orderId={orderId}
                    selectedOrder={selectedOrder}
                  />
                  <PaymentsCard
                    orderId={orderId}
                    selectedOrder={selectedOrder}
                  />
                  <div className="flex gap-6 items-start">
                    <div className="flex-1 min-w-0">
                      <OrderInfoCard order={selectedOrder} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CustomerInfoCard
                        customer={selectedOrder.customer}
                        showStatusToggle={false}
                        onSuccess={handleStatusSuccess}
                      />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "finance" && (
                <FinanceTab
                  transactions={selectedOrder.transactions}
                  totalIncome={selectedOrder.totalIncome}
                />
              )}
            </div>
            <HistorySidebar orderId={selectedOrder.id} history={history} />
          </div>
          <Suspense>
            <PrintDialog
              isOpen={isPrintOpen}
              onOpenChange={setIsPrintOpen}
              orderId={orderId}
              documents={selectedOrder.documents}
            />
          </Suspense>
        </>
      )}
    </QueryPageGuard>
  );
};

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : NaN;

  if (!Number.isFinite(orderId)) {
    return <NotFoundPage />;
  }

  return <OrderPageContent orderId={orderId} />;
};

export default OrderPage;
