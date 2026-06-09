import { Box, Cog } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const AddOrderItemModal = lazy(
  () =>
    import("@/features/backoffice/modules/orders/components/info-table/AddOrderItemModal.tsx"),
);
import { type InfoTableColumn } from "@/features/backoffice/modules/orders/components/info-table/InfoTable.tsx";
import { OrderTableCard } from "@/features/backoffice/modules/orders/components/order-table-card/OrderTableCard.tsx";
import { useDeleteOrderItem } from "@/features/backoffice/modules/orders/hooks/useDeleteOrderItem.ts";
import { calcOrderItemTotal } from "@/features/backoffice/modules/orders/lib/cellFormatters.tsx";
import { type ModalState } from "@/features/backoffice/modules/orders/pages/order-page/types.ts";
import {
  type OrderInfo,
  type OrderItem,
} from "@/features/backoffice/modules/orders/types.ts";

interface ProductsAndServicesCardProps {
  orderId: number;
  selectedOrder: OrderInfo;
}

export const ProductsAndServicesCard = ({
  orderId,
  selectedOrder,
}: ProductsAndServicesCardProps) => {
  const { onDelete, isPending: isDeleting } = useDeleteOrderItem(orderId);
  const [modalState, setModalState] = useState<ModalState>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Insert" || e.shiftKey) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      setModalState({ mode: "add", type: "service" });
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
  ];

  const buttons = [
    {
      label: t("orders.orderTable.addProduct"),
      onClick: () => setModalState({ mode: "add", type: "product" }),
    },
    {
      label: t("orders.orderTable.addService"),
      onClick: () => setModalState({ mode: "add", type: "service" }),
    },
  ];

  return (
    <>
      <OrderTableCard
        buttons={buttons}
        columns={columns}
        data={orderItems}
        onDelete={onDelete}
        isDeleting={isDeleting}
        isUnchangeable={(item) => !!item.completedAt}
        onRowClick={(item) =>
          setModalState({ mode: "edit", item, readOnly: !!item.completedAt })
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
