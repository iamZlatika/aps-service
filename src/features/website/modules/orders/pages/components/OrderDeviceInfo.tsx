import { Laptop } from "lucide-react";
import { useTranslation } from "react-i18next";

import { OrderSectionCard } from "@/features/website/modules/orders/pages/components/OrderSectionCard";
import { type OrderDetail } from "@/features/website/modules/orders/types";
import { useLocalize } from "@/shared/hooks/useLocalize";
import { cn, formatDate } from "@/shared/lib/utils";

interface OrderDeviceInfoProps {
  order: OrderDetail;
}

export const OrderDeviceInfo = ({ order }: OrderDeviceInfoProps) => {
  const { t } = useTranslation("website");
  const localize = useLocalize();

  const rows = [
    { label: t("cabinet.specDeviceType"), value: order.deviceType },
    { label: t("cabinet.specManufacturer"), value: order.manufacturer },
    { label: t("cabinet.specModel"), value: order.deviceModel },
    { label: t("cabinet.specIssue"), value: order.issueType },
    { label: t("cabinet.specCondition"), value: order.deviceCondition },
    { label: t("cabinet.specAccessory"), value: order.accessory },
    {
      label: t("cabinet.specLocation"),
      value: localize(order.location.addressRu, order.location.addressUa),
    },
    { label: t("cabinet.specDueDate"), value: formatDate(order.dueDate) },
    {
      label: t("cabinet.specEstimatedCost"),
      value: order.estimatedCost ? `${order.estimatedCost} ₴` : null,
    },
  ];

  return (
    <OrderSectionCard
      icon={<Laptop className="size-[17px]" aria-hidden="true" />}
      title={t("cabinet.deviceInfoTitle")}
    >
      <dl className="m-0">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[200px_1fr] items-baseline gap-3.5 border-b border-ws-line-soft py-3.5 last:border-b-0 max-[560px]:grid-cols-1 max-[560px]:gap-1"
          >
            <dt className="text-[13px] text-ws-ink-soft">{row.label}</dt>
            <dd
              className={cn(
                "text-[14.5px] font-medium leading-[1.45] text-pretty",
                row.value
                  ? "text-ws-ink"
                  : "font-normal italic text-ws-ink-mute",
              )}
            >
              {row.value ?? t("track.specs.missing")}
            </dd>
          </div>
        ))}
      </dl>
    </OrderSectionCard>
  );
};
