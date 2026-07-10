import { format } from "date-fns";
import { Printer } from "lucide-react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { CustomerInfoCard } from "@/features/backoffice/modules/customers/components/CustomerInfoCard";
import { CustomerOrdersSection } from "@/features/backoffice/modules/customers/components/CustomerOrdersSection";
import { StatusSelect } from "@/features/backoffice/modules/orders/components/StatusSelect.tsx";
import { useCreateOrderForCustomer } from "@/features/backoffice/modules/orders/hooks/useCreateOrderForCustomer.ts";
import { useOrder } from "@/features/backoffice/modules/orders/hooks/useOrder.ts";
import { useOrderCustomerTelegramSocket } from "@/features/backoffice/modules/orders/hooks/useOrderCustomerTelegramSocket.ts";
import { useOrderEditingState } from "@/features/backoffice/modules/orders/hooks/useOrderEditingState.ts";
import { useOrderSocket } from "@/features/backoffice/modules/orders/hooks/useOrderSocket.ts";
import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation.ts";
import { HistorySidebar } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/HistorySidebar.tsx";
import { MobileHistoryDrawer } from "@/features/backoffice/modules/orders/pages/order-page/components/history-sidebar/MobileHistoryDrawer.tsx";
import { PaymentsCard } from "@/features/backoffice/modules/orders/pages/order-page/components/PaymentsCard.tsx";
import { ProductsAndServicesCard } from "@/features/backoffice/modules/orders/pages/order-page/components/ProductsAndServicesCard.tsx";
import { buildOrderHistory } from "@/features/backoffice/modules/orders/pages/order-page/services.ts";
import { queryClient } from "@/shared/api/queryClient.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { CreateOrderForCustomerButton } from "@/shared/components/common/buttons/index.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";
import NotFoundPage from "@/shared/components/errors/NotFound.tsx";
import { QueryPageGuard } from "@/shared/components/errors/QueryPageGuard.tsx";
import { useIsMobile } from "@/shared/hooks/useMobile.ts";
import { cn } from "@/shared/lib/utils.ts";

import { EditConflictDialog } from "./components/EditConflictDialog.tsx";
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
  const location = useLocation();
  const backSearch = (location.state as { back?: string } | null)?.back ?? "";
  const isMobile = useIsMobile();
  const { selectedOrder, isLoading, isError, error, refetch } =
    useOrder(orderId);
  useOrderSocket(orderId);
  useOrderCustomerTelegramSocket(orderId, selectedOrder?.customer.id ?? null);

  const { can } = useAuth();
  const canManageOrders = can("orders_manage");

  const { createOrderForCustomer } = useCreateOrderForCustomer();

  const {
    editingOrderIds,
    formValuesStorage,
    editConflict,
    handleStartEditing,
    handleStopEditing,
    handleConflictConfirm,
    handleConflictCancel,
  } = useOrderEditingState();

  const locationKeyRef = useRef(location.key);
  locationKeyRef.current = location.key;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (locationKeyRef.current === "default") {
          navigate(ORDERS_LINKS.root());
        } else {
          navigate(-1);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<OrderTab>("order");

  useEffect(() => {
    setIsPrintOpen(false);
    setActiveTab("order");
  }, [orderId]);

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
    <>
      <QueryPageGuard
        isLoading={isLoading}
        loadingFallback={<Loader />}
        isError={isError}
        error={error}
        onRetry={refetch}
      >
        {selectedOrder && (
          <>
            <>
              <div className="absolute inset-0 flex overflow-hidden">
                <div className="flex-1 overflow-y-auto p-2 pb-14 sm:p-6 [scrollbar-gutter:stable]">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h1 className="text-lg sm:text-2xl font-bold">
                        {t("orders.order")} {selectedOrder.orderNumber}
                      </h1>
                      <div className="flex items-center gap-2 shrink-0">
                        {canManageOrders && (
                          <CreateOrderForCustomerButton
                            onClick={() =>
                              createOrderForCustomer(selectedOrder.customer)
                            }
                          />
                        )}
                        <button
                          type="button"
                          className="h-9 w-9 sm:h-12 sm:w-12 flex items-center justify-center rounded-md border bg-card text-muted-foreground hover:text-foreground shadow-sm transition-colors"
                          onClick={() => setIsPrintOpen(true)}
                        >
                          <Printer className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <StatusSelect
                        orderId={orderId}
                        status={selectedOrder.status}
                        remainingToPay={selectedOrder.remainingToPay}
                        onSuccess={handleStatusSuccess}
                      />
                      <span className="text-muted-foreground text-base sm:text-2xl">
                        {parseFloat(selectedOrder.remainingToPay) < 0
                          ? t("orders.overpayment")
                          : t("orders.remainingToPay")}
                        :{" "}
                        <span
                          className={cn(
                            "font-medium text-base sm:text-2xl",
                            parseFloat(selectedOrder.remainingToPay) < 0
                              ? "text-destructive"
                              : "text-green-500",
                          )}
                        >
                          {selectedOrder.remainingToPay} ₴
                        </span>
                      </span>
                    </div>

                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <p className="text-muted-foreground text-sm sm:text-base font-medium">
                          {t("orders.acceptedBy")}: {selectedOrder.manager.name}
                        </p>
                        <p className="text-muted-foreground text-sm sm:text-base font-medium">
                          {t("orders.form.location")}:{" "}
                          {selectedOrder.location.name}
                        </p>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          {selectedOrder.closedAt
                            ? `${t("orders.createdAt")}: ${format(new Date(selectedOrder.createdAt), "dd.MM.yyyy")} — ${t("orders.closedAt")}: ${format(new Date(selectedOrder.closedAt), "dd.MM.yyyy")}`
                            : `${t("orders.createdAt")}: ${format(new Date(selectedOrder.createdAt), "dd.MM.yyyy")}`}
                        </p>
                      </div>
                      <div className="flex gap-4 sm:gap-5 shrink-0">
                        {(["order", "finance"] as OrderTab[]).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                              "pb-2 text-sm sm:text-base whitespace-nowrap transition-colors focus:outline-none border-b-2",
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
                        canManage={canManageOrders}
                      />
                      <PaymentsCard
                        orderId={orderId}
                        selectedOrder={selectedOrder}
                        canManage={canManageOrders}
                      />
                      <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="flex-1 min-w-0 w-full">
                          <OrderInfoCard
                            order={selectedOrder}
                            isEditing={editingOrderIds.has(orderId)}
                            onStartEditing={() => handleStartEditing(orderId)}
                            onStopEditing={() => handleStopEditing(orderId)}
                            formValuesStorage={formValuesStorage}
                            canManage={canManageOrders}
                          />
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                          <CustomerInfoCard
                            customer={selectedOrder.customer}
                            showStatusToggle={false}
                            onSuccess={handleStatusSuccess}
                          />
                          <CustomerOrdersSection
                            customerId={selectedOrder.customer.id}
                            currentOrderId={orderId}
                            backSearch={backSearch}
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
                {!isMobile && (
                  <HistorySidebar orderId={orderId} history={history} />
                )}
              </div>
              {isMobile && (
                <MobileHistoryDrawer orderId={orderId} history={history} />
              )}
            </>
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

      <EditConflictDialog
        isOpen={editConflict !== null}
        onConfirm={handleConflictConfirm}
        onCancel={handleConflictCancel}
      />
    </>
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
