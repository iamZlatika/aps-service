import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { StatusBadge } from "@/features/website/components/StatusBadge";
import { CUSTOMER_ORDERS_LINKS } from "@/features/website/modules/orders/navigation";
import { type OrderListItem } from "@/features/website/modules/orders/types";
import { formatDate } from "@/shared/lib/utils";

interface OrderListCardProps {
  order: OrderListItem;
}

export const OrderListCard = ({ order }: OrderListCardProps) => {
  const { t } = useTranslation("website");
  const dueDate = formatDate(order.dueDate);

  return (
    <Link
      to={CUSTOMER_ORDERS_LINKS.detail(order.id)}
      className="group grid grid-cols-[154px_1.4fr_150px_120px_30px] items-center gap-[18px] rounded-[14px] border border-ws-line bg-[rgba(255,255,255,.015)] px-5 py-4 no-underline transition-all duration-150 hover:-translate-y-px hover:border-ws-ember max-[860px]:relative max-[860px]:grid-cols-2 max-[860px]:gap-x-4 max-[860px]:gap-y-3.5 max-[860px]:p-[18px]"
    >
      <span className="text-[13.5px] font-bold tabular-nums tracking-[-0.005em] text-ws-ink max-[860px]:col-span-2 max-[860px]:pr-9">
        {order.orderNumber}
      </span>

      <span className="min-w-0 max-[860px]:col-span-2">
        <span className="mb-[3px] hidden text-[10px] font-semibold uppercase tracking-[.12em] text-ws-ink-mute max-[860px]:block">
          {t("cabinet.orderDeviceLabel")}
        </span>
        <h4 className="text-ws-md font-semibold leading-[1.25] text-ws-ink">
          {order.manufacturer} {order.deviceModel}
        </h4>
        <p className="truncate text-ws-xs leading-[1.4] text-ws-ink-soft">
          {order.deviceType}
        </p>
      </span>

      <span className="justify-self-start max-[860px]:border-t max-[860px]:border-ws-line-soft max-[860px]:pt-3.5">
        <StatusBadge status={order.status} />
      </span>

      <span className="text-right max-[860px]:border-t max-[860px]:border-ws-line-soft max-[860px]:pt-3.5">
        {dueDate && (
          <span className="block text-[12.5px] tabular-nums text-ws-ink-soft">
            {dueDate}
          </span>
        )}
        <span
          className={
            order.estimatedCost
              ? "mt-[3px] block text-[14px] font-bold tabular-nums text-ws-ink"
              : "mt-[3px] block text-[12px] font-medium text-ws-ink-mute"
          }
        >
          {order.estimatedCost
            ? `≈ ${order.estimatedCost} ₴`
            : t("cabinet.ordersCostPending")}
        </span>
      </span>

      <span className="flex justify-end text-ws-ink-mute transition-colors duration-150 group-hover:text-ws-ember-bright max-[860px]:absolute max-[860px]:right-[18px] max-[860px]:top-[18px]">
        <ChevronRight className="size-[18px]" aria-hidden="true" />
      </span>
    </Link>
  );
};
