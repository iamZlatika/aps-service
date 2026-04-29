import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import AddLineItemModal from "@/features/backoffice/modules/orders/components/info-table/AddLineItemModal.tsx";
import {
  InfoTable,
  type InfoTableColumn,
} from "@/features/backoffice/modules/orders/components/info-table/InfoTable.tsx";
import { useDeleteLineItem } from "@/features/backoffice/modules/orders/hooks/useDeleteLineItem.ts";
import { calcLineItemTotal } from "@/features/backoffice/modules/orders/lib/cellFormatters.tsx";
import { type ModalState } from "@/features/backoffice/modules/orders/pages/order-page/types.ts";
import {
  type OrderInfo,
  type OrderLineItem,
} from "@/features/backoffice/modules/orders/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";

interface ProductsAndServicesCardProps {
  orderId: number;
  selectedOrder: OrderInfo;
}
export const ProductsAndServicesCard = ({
  orderId,
  selectedOrder,
}: ProductsAndServicesCardProps) => {
  const [filter, setFilter] = useState({ product: true, service: true });
  const { onDelete, isPending: isDeleting } = useDeleteLineItem(orderId);
  const [modalState, setModalState] = useState<ModalState>(null);
  const { t } = useTranslation();

  const modalType =
    modalState?.mode === "edit"
      ? modalState.item.type
      : modalState?.mode === "add"
        ? modalState.type
        : null;

  const toggleFilter = (type: "product" | "service") => {
    setFilter((prev) => {
      const other = type === "product" ? "service" : "product";
      if (prev[type] && !prev[other])
        return { product: !prev.product, service: !prev.service };
      return { ...prev, [type]: !prev[type] };
    });
  };

  const lineItems = useMemo<OrderLineItem[]>(() => {
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
        key: "manager",
        label: t("orders.orderTable.user"),
        render: (row) => row.manager?.name ?? "—",
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

  return (
    <>
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
            onAddProduct={() => setModalState({ mode: "add", type: "product" })}
            onAddService={() => setModalState({ mode: "add", type: "service" })}
          />
        </CardContent>
      </Card>
      {modalState !== null && modalType !== null && (
        <AddLineItemModal
          orderId={orderId}
          type={modalType}
          open
          onClose={() => setModalState(null)}
          editItem={modalState.mode === "edit" ? modalState.item : undefined}
        />
      )}
    </>
  );
};
