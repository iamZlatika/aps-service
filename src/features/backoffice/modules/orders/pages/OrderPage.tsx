import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import HistorySidebar from "@/features/backoffice/modules/orders/components/HistorySidebar.tsx";
import AddLineItemModal from "@/features/backoffice/modules/orders/components/info-table/AddLineItemModal.tsx";
import type { InfoTableColumn } from "@/features/backoffice/modules/orders/components/info-table/InfoTable.tsx";
import { InfoTable } from "@/features/backoffice/modules/orders/components/info-table/InfoTable.tsx";
import { useDeleteLineItem } from "@/features/backoffice/modules/orders/hooks/useDeleteLineItem.ts";
import { useOrder } from "@/features/backoffice/modules/orders/hooks/useOrder.ts";
import type { OrderLineItem } from "@/features/backoffice/modules/orders/types.ts";
import Loader from "@/shared/components/common/Loader.tsx";
import { Card, CardContent } from "@/shared/components/ui/card";

type ModalType = "product" | "service";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : null;
  const { t } = useTranslation();
  const { selectedOrder, isLoading } = useOrder(orderId);
  const { onDelete } = useDeleteLineItem(orderId ?? 0);
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const lineItems = useMemo<OrderLineItem[]>(() => {
    const products = (selectedOrder?.products ?? []).map((p) => ({
      ...p,
      type: "product" as const,
    }));
    const services = (selectedOrder?.services ?? []).map((s) => ({
      ...s,
      type: "service" as const,
    }));
    return [...products, ...services].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [selectedOrder?.products, selectedOrder?.services]);

  const columns = useMemo<InfoTableColumn<OrderLineItem>[]>(
    () => [
      {
        key: "name",
        label: t("orders.orderTable.name"),
      },
      {
        key: "user",
        label: t("orders.orderTable.user"),
        render: (row) => row.user?.name ?? "—",
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
        render: (row) => (parseFloat(row.price) * row.quantity).toFixed(2),
      },
      {
        key: "purchase_price",
        label: t("orders.orderTable.purchasePrice"),
        collapsible: true,
        render: (row) => (row.type === "product" ? row.purchasePrice : "—"),
      },
    ],
    [t],
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!selectedOrder) {
    return null;
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-2 sm:p-6">
        <h1 className="mb-6 text-2xl font-bold">
          {t("orders.order")} {selectedOrder.orderNumber}
        </h1>
        <Card className="p-2 sm:p-6">
          <CardContent>
            <InfoTable
              columns={columns}
              data={lineItems}
              onDelete={onDelete}
              onAddProduct={() => setModalType("product")}
              onAddService={() => setModalType("service")}
            />
          </CardContent>
        </Card>
      </div>
      <HistorySidebar orderId={selectedOrder.id} />
      {modalType !== null && (
        <AddLineItemModal
          orderId={selectedOrder.id}
          type={modalType}
          open={modalType !== null}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
};

export default OrderPage;
