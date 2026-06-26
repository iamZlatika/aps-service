import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { type InfoTableColumn } from "@/features/backoffice/modules/orders/components/info-table/InfoTable.tsx";
import { OrderTableCard } from "@/features/backoffice/modules/orders/components/order-table-card/OrderTableCard.tsx";
import { useDeletePayment } from "@/features/backoffice/modules/orders/hooks/useDeletePayment.ts";

const AddPaymentModal = lazy(
  () =>
    import("@/features/backoffice/modules/orders/pages/order-page/components/AddPaymentModal.tsx"),
);
import type {
  OrderInfo,
  OrderPayment,
} from "@/features/backoffice/modules/orders/types.ts";
import { PAYMENTS, type PaymentType } from "@/shared/types.ts";

const PAYMENT_TYPE_ORDER = [
  PAYMENTS.PREPAYMENT,
  PAYMENTS.PAYMENT,
  PAYMENTS.REFUND,
] as const;

interface PaymentsCardProps {
  orderId: number;
  selectedOrder: OrderInfo;
}

export const PaymentsCard = ({ orderId, selectedOrder }: PaymentsCardProps) => {
  const { t } = useTranslation();
  const [modalType, setModalType] = useState<PaymentType | null>(null);
  const { onDelete, isPending: isDeleting } = useDeletePayment(orderId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Insert" || !e.shiftKey) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      setModalType(PAYMENTS.PREPAYMENT);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activePayments = selectedOrder.payments
    .filter((p) => !p.deletedAt)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const columns: InfoTableColumn<OrderPayment>[] = [
    {
      key: "type",
      label: t("orders.payments.table.type"),
      render: (row) => t(`orders.payments.types.${row.type}`),
    },
    {
      key: "method",
      label: t("orders.payments.table.method"),
      render: (row) => t(`orders.paymentMethods.${row.method}`),
    },
    {
      key: "manager",
      label: t("orders.payments.table.manager"),
      render: (row) => row.manager?.name ?? "—",
    },
    {
      key: "createdAt",
      label: t("orders.payments.table.date"),
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "note",
      label: t("orders.payments.table.note"),
      render: (row) => row.note ?? "—",
    },
    {
      key: "amount",
      label: t("orders.payments.table.amount"),
    },
  ];

  const buttons = PAYMENT_TYPE_ORDER.map((type) => ({
    label: t(`orders.payments.types.${type}`),
    onClick: () => setModalType(type),
  }));

  return (
    <>
      <OrderTableCard
        buttons={buttons}
        columns={columns}
        data={activePayments}
        onDelete={onDelete}
        isDeleting={isDeleting}
        footer={
          <span className="text-sm text-muted-foreground">
            {t("orders.payments.totalPaid")}:{" "}
            <span className="font-medium text-foreground">
              {selectedOrder.totalPaid} ₴
            </span>
          </span>
        }
      />
      {modalType !== null && (
        <Suspense>
          <AddPaymentModal
            orderId={orderId}
            type={modalType}
            open
            onClose={() => setModalType(null)}
          />
        </Suspense>
      )}
    </>
  );
};
