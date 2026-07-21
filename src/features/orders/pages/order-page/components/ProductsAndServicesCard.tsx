import { Box, Cog } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const AddOrderItemModal = lazy(
  () => import("@/features/orders/components/info-table/AddOrderItemModal.tsx"),
);
import { type InfoTableColumn } from "@/features/orders/components/info-table/InfoTable.tsx";
import { OrderTableCard } from "@/features/orders/components/order-table-card/OrderTableCard.tsx";
import { useDeleteOrderItem } from "@/features/orders/hooks/useDeleteOrderItem.ts";
import { calcOrderItemTotal } from "@/features/orders/lib/cellFormatters.tsx";
import { type ModalState } from "@/features/orders/pages/order-page/types.ts";
import { type OrderInfo, type OrderItem } from "@/features/orders/types.ts";
import { useKeyboardShortcut } from "@/shared/hooks/useKeyboardShortcut.ts";

interface ProductsAndServicesCardProps {
  orderId: number;
  selectedOrder: OrderInfo;
  canManage: boolean;
}

export const ProductsAndServicesCard = ({
  orderId,
  selectedOrder,
  canManage,
}: ProductsAndServicesCardProps) => {
  const { onDelete, isPending: isDeleting } = useDeleteOrderItem(orderId);
  const [modalState, setModalState] = useState<ModalState>(null);
  const { t } = useTranslation();

  useKeyboardShortcut({
    key: "Insert",
    enabled: canManage,
    onTrigger: () => setModalState({ mode: "add", type: "service" }),
  });

  const modalType =
    modalState?.mode === "edit"
      ? modalState.item.type
      : modalState?.mode === "add"
        ? modalState.type
        : null;

  const orderItems = useMemo<OrderItem[]>(() => {
    const products = selectedOrder.products.map((p) => ({
      ...p,
      type: "product" as const,
    }));
    const services = selectedOrder.services.map((s) => ({
      ...s,
      type: "service" as const,
    }));
    return [...products, ...services]
      .filter((item) => !item.deletedAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [selectedOrder?.products, selectedOrder?.services]);

  const totalCost = useMemo(
    () =>
      orderItems
        .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
        .toFixed(),
    [orderItems],
  );

  const columns: InfoTableColumn<OrderItem>[] = [
    {
      key: "name",
      label: t("orders.orderTable.name"),
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
      key: "manager",
      label: t("orders.orderTable.user"),
      render: (row) => row.manager.name,
    },
    {
      key: "created_by",
      label: t("orders.orderTable.createdBy"),
      collapsible: true,
      render: (row) => row.createdByUser?.name ?? "—",
    },
    {
      key: "quantity",
      label: t("orders.orderTable.quantity"),
    },
    {
      key: "price",
      label: t("orders.orderTable.price"),
    },
    {
      key: "total_price",
      label: t("orders.orderTable.totalPrice"),
      render: (row) => calcOrderItemTotal(row.price, row.quantity),
    },
    {
      key: "purchase_price",
      label: t("orders.orderTable.purchasePrice"),
      collapsible: true,
      render: (row) =>
        row.type === "product"
          ? (row.purchasePrice ?? "—")
          : (row.costPrice ?? "—"),
    },
    {
      key: "contractor",
      label: t("orders.orderTable.contractor"),
      collapsible: true,
      render: (row) =>
        row.type === "product"
          ? (row.supplier?.name ?? "—")
          : (row.outsourcer?.name ?? "—"),
    },
  ];

  const buttons = canManage
    ? [
        {
          label: t("orders.orderTable.addProduct"),
          onClick: () => setModalState({ mode: "add", type: "product" }),
        },
        {
          label: t("orders.orderTable.addService"),
          onClick: () => setModalState({ mode: "add", type: "service" }),
        },
      ]
    : [];

  return (
    <>
      <OrderTableCard
        buttons={buttons}
        columns={columns}
        data={orderItems}
        onDelete={canManage ? onDelete : undefined}
        isDeleting={isDeleting}
        isUnchangeable={(item) => !!item.completedAt}
        onRowClick={(item) =>
          setModalState({
            mode: "edit",
            item,
            readOnly: !canManage || !!item.completedAt,
          })
        }
        getRowKey={(row) => `${row.type}-${row.id}`}
        footer={
          <span className="text-sm text-muted-foreground">
            {t("orders.orderTable.totalCost")}:{" "}
            <span className="font-medium text-foreground">{totalCost} ₴</span>
          </span>
        }
      />
      {modalState !== null && modalType !== null && (
        <Suspense>
          <AddOrderItemModal
            orderId={orderId}
            type={modalType}
            open
            onClose={() => setModalState(null)}
            editItem={modalState.mode === "edit" ? modalState.item : undefined}
            readOnly={
              modalState.mode === "edit" ? !!modalState.readOnly : false
            }
          />
        </Suspense>
      )}
    </>
  );
};
