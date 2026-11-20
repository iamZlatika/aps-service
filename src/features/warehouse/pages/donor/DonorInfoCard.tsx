import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ORDERS_LINKS } from "@/features/orders/navigation.ts";
import { QUICK_ORDERS_LINKS } from "@/features/quick-orders/navigation.ts";
import { InfoField } from "@/features/warehouse/components/InfoField.tsx";
import { getStoragePlaceLabel } from "@/features/warehouse/lib/service.ts";
import type { DonorDetail } from "@/features/warehouse/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";
import { formatDate } from "@/shared/lib/utils.ts";

interface DonorInfoCardProps {
  donor: DonorDetail;
}

interface OrderLinkProps {
  orderId: number;
}

const OrderLink = ({ orderId }: OrderLinkProps) => {
  const { t } = useTranslation();
  return (
    <Link
      to={ORDERS_LINKS.detail(orderId)}
      className="text-primary hover:underline"
    >
      {t("warehouse.stock.order", { id: orderId })}
    </Link>
  );
};

interface QuickOrderLinkProps {
  quickOrderId: number;
}

const QuickOrderLink = ({ quickOrderId }: QuickOrderLinkProps) => {
  const { t } = useTranslation();
  return (
    <Link
      to={QUICK_ORDERS_LINKS.detail(quickOrderId)}
      className="text-primary hover:underline"
    >
      {t("warehouse.stock.quickOrder", { id: quickOrderId })}
    </Link>
  );
};

export const DonorInfoCard = ({ donor }: DonorInfoCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="p-2 sm:p-6">
      <CardContent className="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        <InfoField label={t("warehouse.donor.fields.manufacturer")}>
          {donor.manufacturer}
        </InfoField>
        <InfoField label={t("warehouse.donor.fields.deviceType")}>
          {donor.deviceType}
        </InfoField>
        <InfoField label={t("warehouse.donor.fields.deviceModel")}>
          {donor.deviceModel}
        </InfoField>
        <InfoField label={t("warehouse.donor.fields.location")}>
          {donor.location?.name}
        </InfoField>
        <InfoField label={t("warehouse.donor.fields.storagePlace")}>
          {getStoragePlaceLabel(donor)}
        </InfoField>
        <InfoField label={t("warehouse.donor.fields.acquisitionCost")}>
          {donor.acquisitionCost !== null && (
            <MoneyAmount value={donor.acquisitionCost} />
          )}
        </InfoField>
        {donor.origin && (
          <InfoField label={t("warehouse.donor.fields.origin")}>
            {donor.origin}
          </InfoField>
        )}
        {/* Set by the system when the donor was born from an order. */}
        {donor.sourceOrderId !== null && (
          <InfoField label={t("warehouse.donor.sourceOrder")}>
            <OrderLink orderId={donor.sourceOrderId} />
          </InfoField>
        )}
        {donor.soldInOrderId !== null && (
          <InfoField label={t("warehouse.donor.soldInOrder")}>
            <OrderLink orderId={donor.soldInOrderId} />
          </InfoField>
        )}
        {donor.soldInQuickOrderId !== null && (
          <InfoField label={t("warehouse.donor.soldInQuickOrder")}>
            <QuickOrderLink quickOrderId={donor.soldInQuickOrderId} />
          </InfoField>
        )}
        {donor.soldAt && (
          <InfoField label={t("warehouse.donor.soldAt")}>
            {formatDate(donor.soldAt)}
          </InfoField>
        )}
        {donor.soldPrice && (
          <InfoField label={t("warehouse.donor.soldPrice")}>
            <MoneyAmount value={donor.soldPrice} />
          </InfoField>
        )}
        <InfoField label={t("warehouse.donor.fields.supplier")}>
          {donor.supplier?.name}
        </InfoField>
        {donor.note && (
          <InfoField label={t("warehouse.donor.fields.note")}>
            {donor.note}
          </InfoField>
        )}
      </CardContent>
    </Card>
  );
};
