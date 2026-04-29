import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  InfoTable,
  type InfoTableColumn,
} from "@/features/backoffice/modules/orders/components/info-table/InfoTable.tsx";
import AddPaymentModal from "@/features/backoffice/modules/orders/pages/order-page/components/AddPaymentModal.tsx";
import type {
  OrderInfo,
  OrderPayment,
} from "@/features/backoffice/modules/orders/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";
import { PAYMENTS, type PaymentType } from "@/shared/types.ts";

const PAYMENT_TYPE_ORDER = [
  PAYMENTS.PREPAYMENT,
  PAYMENTS.PAYMENT,
  PAYMENTS.REFUND,
] as const;

type PaymentFilter = Record<PaymentType, boolean>;

interface PaymentsCardProps {
  orderId: number;
  selectedOrder: OrderInfo;
}

export const PaymentsCard = ({ orderId, selectedOrder }: PaymentsCardProps) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<PaymentFilter>({
    prepayment: true,
    payment: true,
    refund: true,
  });

  const toggleFilter = (type: PaymentType) => {
    setFilter((prev) => {
      const isSolo =
        prev[type] &&
        PAYMENT_TYPE_ORDER.every((pt) => pt === type || !prev[pt]);
      if (isSolo) {
        const currentIndex = PAYMENT_TYPE_ORDER.indexOf(type);
        const nextType =
          PAYMENT_TYPE_ORDER[(currentIndex + 1) % PAYMENT_TYPE_ORDER.length];
        return {
          prepayment: false,
          payment: false,
          refund: false,
          [nextType]: true,
        };
      }
      return { ...prev, [type]: !prev[type] };
    });
  };

  const filteredPayments = useMemo(
    () => selectedOrder.payments.filter((p) => filter[p.type]),
    [selectedOrder.payments, filter],
  );

  const columns = useMemo<InfoTableColumn<OrderPayment>[]>(
    () => [
      {
        key: "type",
        label: t("orders.payments.table.type"),
        render: (row) => t(`orders.payments.types.${row.type}`),
      },

      {
        key: "note",
        label: t("orders.payments.table.note"),
        render: (row) => row.note ?? "—",
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
        key: "amount",
        label: t("orders.payments.table.amount"),
      },
    ],
    [t],
  );

  return (
    <>
      <Card className="p-2 sm:p-6">
        <CardContent>
          <div className="mb-3 flex gap-2">
            {PAYMENT_TYPE_ORDER.map((type) => (
              <Button
                key={type}
                variant={filter[type] ? "default" : "outline"}
                className="text-base"
                onClick={() => toggleFilter(type)}
              >
                {t(`orders.payments.types.${type}`)}
              </Button>
            ))}
          </div>
          <InfoTable
            columns={columns}
            data={filteredPayments}
            footer={
              <span className="text-sm text-muted-foreground">
                {t("orders.payments.totalPaid")}:{" "}
                <span className="font-medium text-foreground">
                  {selectedOrder.totalPaid} ₴
                </span>
              </span>
            }
          >
            <Button
              variant="ghost"
              className="text-base text-muted-foreground"
              onClick={() => setModalOpen(true)}
            >
              <Plus size={16} />
              {t("orders.payments.addPayment")}
            </Button>
          </InfoTable>
        </CardContent>
      </Card>
      {modalOpen && (
        <AddPaymentModal
          orderId={orderId}
          open
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};
