import { Box, Cog, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { ABILITIES } from "@/features/auth/abilities.ts";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { DeleteConfirmDialog } from "@/features/orders/components/info-table/DeleteConfirmDialog.tsx";
import { type InfoTableColumn } from "@/features/orders/components/info-table/InfoTable.tsx";
import { OrderTableCard } from "@/features/orders/components/order-table-card/OrderTableCard.tsx";
import { calcOrderItemTotal } from "@/features/orders/lib/cellFormatters.tsx";
import type { OrderProduct, OrderService } from "@/features/orders/types.ts";
import { useDeleteQuickOrder } from "@/features/quick-orders/hooks/useDeleteQuickOrder.ts";
import { useQuickOrder } from "@/features/quick-orders/hooks/useQuickOrder.ts";
import { QUICK_ORDERS_LINKS } from "@/features/quick-orders/navigation.ts";
import QuickOrderFinanceTab from "@/features/quick-orders/pages/quick-order-page/components/QuickOrderFinanceTab.tsx";
import { Loader } from "@/shared/components/common/Loader.tsx";
import NotFoundPage from "@/shared/components/errors/NotFound.tsx";
import { QueryPageGuard } from "@/shared/components/errors/QueryPageGuard.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";
import { cn, formatDate } from "@/shared/lib/utils.ts";

type QuickOrderTab = "sale" | "finance";

type QuickOrderItemRow =
  | (OrderService & { type: "service" })
  | (OrderProduct & { type: "product" });

interface QuickOrderPageContentProps {
  quickOrderId: number;
}

const QuickOrderPageContent = ({
  quickOrderId,
}: QuickOrderPageContentProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { can } = useAuth();
  const canManage = can(ABILITIES.QUICK_ORDERS_MANAGE);
  const [activeTab, setActiveTab] = useState<QuickOrderTab>("sale");
  const [isCancelling, setIsCancelling] = useState(false);

  const { quickOrder, isLoading, isError, error, refetch } =
    useQuickOrder(quickOrderId);

  const { onDelete, isPending: isDeleting } = useDeleteQuickOrder(() =>
    navigate(QUICK_ORDERS_LINKS.root()),
  );

  const rows = useMemo<QuickOrderItemRow[]>(() => {
    if (!quickOrder) return [];
    return [
      ...quickOrder.services.map((s) => ({ ...s, type: "service" as const })),
      ...quickOrder.products.map((p) => ({ ...p, type: "product" as const })),
    ];
  }, [quickOrder]);

  const totalItemsPrice = useMemo(
    () =>
      rows
        .reduce((sum, row) => sum + parseFloat(row.price) * row.quantity, 0)
        .toFixed(),
    [rows],
  );

  const columns: InfoTableColumn<QuickOrderItemRow>[] = [
    {
      key: "name",
      label: t("quickOrders.orderTable.name"),
      render: (row) => (
        <span className="flex items-center gap-1.5">
          {row.type === "product" ? (
            <Box className="h-4 w-4 shrink-0 text-purple-500" />
          ) : (
            <Cog className="h-4 w-4 shrink-0 text-blue-500" />
          )}
          {row.name}
        </span>
      ),
    },
    {
      key: "quantity",
      label: t("quickOrders.orderTable.quantity"),
    },
    {
      key: "price",
      label: t("quickOrders.orderTable.price"),
    },
    {
      key: "totalPrice",
      label: t("quickOrders.orderTable.totalPrice"),
      render: (row) => calcOrderItemTotal(row.price, row.quantity),
    },
    {
      key: "costOrPurchasePrice",
      label: t("quickOrders.orderTable.costOrPurchasePrice"),
      render: (row) =>
        row.type === "product"
          ? (row.purchasePrice ?? "—")
          : (row.costPrice ?? "—"),
    },
  ];

  return (
    <QueryPageGuard
      isLoading={isLoading}
      loadingFallback={<Loader />}
      isError={isError}
      error={error}
      onRetry={refetch}
    >
      {quickOrder && (
        <div className="p-2 sm:p-6 max-w-3xl lg:max-w-7xl mx-auto w-full flex flex-col gap-1.5">
          <div className="flex items-end justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <h1 className="text-lg sm:text-2xl font-bold">
                {quickOrder.number}
              </h1>
              {quickOrder.deletedAt ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-destructive font-bold text-base sm:text-lg">
                  {t("quickOrders.cancelledBanner")}
                </div>
              ) : (
                canManage && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    disabled={isDeleting}
                    onClick={() => setIsCancelling(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("quickOrders.actions.cancel")}
                  </Button>
                )
              )}
            </div>
            <div className="flex gap-4 sm:gap-5 shrink-0">
              {(["sale", "finance"] as QuickOrderTab[]).map((tab) => (
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
                  {t(`quickOrders.tabs.${tab}`)}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "sale" && (
            <div className="flex flex-col gap-6 mt-6">
              <Card className="p-2 sm:p-6">
                <CardContent className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("quickOrders.form.manager")}
                        </p>
                        <p className="font-medium">{quickOrder.manager.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("quickOrders.form.location")}
                        </p>
                        <p className="font-medium">
                          {quickOrder.location?.name ?? "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("quickOrders.form.paymentMethod")}
                        </p>
                        <p className="font-medium">
                          {quickOrder.paymentMethod
                            ? t(
                                `orders.paymentMethods.${quickOrder.paymentMethod}`,
                              )
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("quickOrders.form.createdAt")}
                        </p>
                        <p className="font-medium">
                          {formatDate(quickOrder.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {quickOrder.comment && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("quickOrders.form.comment")}
                      </p>
                      <p className="font-medium">{quickOrder.comment}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <OrderTableCard
                columns={columns}
                data={rows}
                getRowKey={(row) => `${row.type}-${row.id}`}
                footer={
                  <span className="text-sm text-muted-foreground">
                    {t("quickOrders.orderTable.totalPrice")}:{" "}
                    <span className="font-medium text-foreground">
                      {totalItemsPrice} ₴
                    </span>
                  </span>
                }
              />
            </div>
          )}

          {activeTab === "finance" && (
            <QuickOrderFinanceTab
              totalPrice={quickOrder.totalPrice}
              totalCost={quickOrder.totalCost}
              totalIncome={quickOrder.totalIncome}
              transactions={quickOrder.transactions}
            />
          )}
        </div>
      )}
      <DeleteConfirmDialog
        open={isCancelling}
        onConfirm={() => {
          onDelete(quickOrderId);
          setIsCancelling(false);
        }}
        onCancel={() => setIsCancelling(false)}
        title={t("quickOrders.actions.cancelDialog.title")}
        description={t("quickOrders.actions.cancelDialog.description")}
      />
    </QueryPageGuard>
  );
};

const QuickOrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const quickOrderId = id ? parseInt(id, 10) : NaN;

  if (!Number.isFinite(quickOrderId)) {
    return <NotFoundPage />;
  }

  return <QuickOrderPageContent quickOrderId={quickOrderId} />;
};

export default QuickOrderPage;
