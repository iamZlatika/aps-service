import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

import { type InfoTableColumn } from "@/features/orders/components/info-table/InfoTable.tsx";
import { OrderTableCard } from "@/features/orders/components/order-table-card/OrderTableCard.tsx";
import { useDeletePayment } from "@/features/orders/hooks/useDeletePayment.ts";

const AddPaymentModal = lazy(
  () =>
    import("@/features/orders/pages/order-page/components/AddPaymentModal.tsx"),
);
import type { OrderInfo, OrderPayment } from "@/features/orders/types.ts";
import { useKeyboardShortcut } from "@/shared/hooks/useKeyboardShortcut.ts";
import { PAYMENTS, type PaymentType } from "@/shared/types.ts";

const PAYMENT_TYPE_ORDER = [
  PAYMENTS.PREPAYMENT,
  PAYMENTS.PAYMENT,
  PAYMENTS.REFUND,
] as const;

interface PaymentsCardProps {
  orderId: number;
  selectedOrder: OrderInfo;
  canManage: boolean;
}

export const PaymentsCard = ({
  orderId,
  selectedOrder,
  canManage,
}: PaymentsCardProps) => {
  const { t } = useTranslation();
  const [modalType, setModalType] = useState<PaymentType | null>(null);
  const { onDelete, isPending: isDeleting } = useDeletePayment(orderId);

  useKeyboardShortcut({
    key: "Insert",
    shiftKey: true,
    enabled: canManage,
    onTrigger: () => setModalType(PAYMENTS.PREPAYMENT),
  });

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

  const buttons = canManage
    ? PAYMENT_TYPE_ORDER.map((type) => ({
        label: t(`orders.payments.types.${type}`),
        onClick: () => setModalType(type),
      }))
    : [];

  return (
    <>
      <OrderTableCard
        buttons={buttons}
        columns={columns}
        data={activePayments}
        onDelete={canManage ? onDelete : undefined}
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
