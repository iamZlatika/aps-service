import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import HistorySidebar from "@/features/backoffice/modules/orders/components/HistorySidebar.tsx";
import AddLineItemModal from "@/features/backoffice/modules/orders/components/info-table/AddLineItemModal.tsx";
import type { InfoTableColumn } from "@/features/backoffice/modules/orders/components/info-table/InfoTable.tsx";
import { InfoTable } from "@/features/backoffice/modules/orders/components/info-table/InfoTable.tsx";
import { useDeleteLineItem } from "@/features/backoffice/modules/orders/hooks/useDeleteLineItem.ts";
import { useOrder } from "@/features/backoffice/modules/orders/hooks/useOrder.ts";
import { calcLineItemTotal } from "@/features/backoffice/modules/orders/lib/cellFormatters.tsx";
import type { OrderLineItem } from "@/features/backoffice/modules/orders/types.ts";
import Loader from "@/shared/components/common/Loader.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent } from "@/shared/components/ui/card";

type ModalState =
  | { mode: "add"; type: "product" | "service" }
  | { mode: "edit"; item: OrderLineItem }
  | null;

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id!, 10);
  const { t } = useTranslation();
  const { selectedOrder, isLoading } = useOrder(orderId);
  const { onDelete, isPending: isDeleting } = useDeleteLineItem(orderId);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [filter, setFilter] = useState({ product: true, service: true });

  const toggleFilter = (type: "product" | "service") => {
    setFilter((prev) => {
      const other = type === "product" ? "service" : "product";
      if (prev[type] && !prev[other])
        return { product: !prev.product, service: !prev.service };
      return { ...prev, [type]: !prev[type] };
    });
  };

  const lineItems = useMemo<OrderLineItem[]>(() => {
    const products = (selectedOrder?.products ?? []).map((p) => ({
      ...p,
      type: "product" as const,
    }));
    const services = (selectedOrder?.services ?? []).map((s) => ({
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

  const filteredItems = useMemo(
    () => lineItems.filter((item) => filter[item.type]),
    [lineItems, filter],
  );

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
        render: (row) => calcLineItemTotal(row.price, row.quantity),
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

  const modalType =
    modalState?.mode === "edit"
      ? modalState.item.type
      : modalState?.mode === "add"
        ? modalState.type
        : null;

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-2 sm:p-6">
        <h1 className="mb-6 text-2xl font-bold">
          {t("orders.order")} {selectedOrder.orderNumber}
        </h1>
        <Card className="p-2 sm:p-6">
          <CardContent>
            <div className="mb-3 flex gap-2">
              <Button
                variant={filter.product ? "default" : "outline"}
                className="text-base"
                onClick={() => toggleFilter("product")}
              >
                {t("orders.orderTable.products")}
              </Button>
              <Button
                variant={filter.service ? "default" : "outline"}
                className="text-base"
                onClick={() => toggleFilter("service")}
              >
                {t("orders.orderTable.services")}
              </Button>
            </div>
            <InfoTable
              columns={columns}
              data={filteredItems}
              onDelete={onDelete}
              isDeleting={isDeleting}
              onRowClick={(item) => setModalState({ mode: "edit", item })}
              getRowKey={(row) => `${row.type}-${row.id}`}
              onAddProduct={() =>
                setModalState({ mode: "add", type: "product" })
              }
              onAddService={() =>
                setModalState({ mode: "add", type: "service" })
              }
            />
          </CardContent>
        </Card>
      </div>
      <HistorySidebar orderId={selectedOrder.id} />
      {modalState !== null && modalType !== null && (
        <AddLineItemModal
          orderId={selectedOrder.id}
          type={modalType}
          open
          onClose={() => setModalState(null)}
          editItem={modalState.mode === "edit" ? modalState.item : undefined}
        />
      )}
    </div>
  );
};

export default OrderPage;
