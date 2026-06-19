import { useTranslation } from "react-i18next";

import { OrderListCard } from "@/features/website/modules/orders/components/OrderListCard";
import { OrdersPager } from "@/features/website/modules/orders/components/OrdersPager";
import { useCustomerOrders } from "@/features/website/modules/orders/hooks/useCustomerOrders";

export const OrdersList = () => {
  const { t } = useTranslation("website");
  const { orders, meta, page, setPage, isLoading, isError, refetch } =
    useCustomerOrders();

  if (isLoading) {
    return (
      <p className="mt-6 text-ws-base text-ws-ink-mute">
        {t("cabinet.ordersLoading")}
      </p>
    );
  }

  if (isError) {
    return (
      <div className="mt-6">
        <p className="text-ws-base text-ws-red-bright">
          {t("cabinet.ordersError")}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="ws-btn ws-btn-ghost mt-3"
        >
          {t("cabinet.ordersRetry")}
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="mt-6 text-ws-base text-ws-ink-mute">
        {t("cabinet.ordersEmpty")}
      </p>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-[18px] flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="text-[22px] font-medium tracking-[-0.01em] text-ws-ink">
          {t("cabinet.ordersTitle")}
        </h2>
        {meta && (
          <span className="text-[13px] tracking-[.01em] text-ws-ink-mute">
            <b className="font-semibold tabular-nums text-ws-ink">
              {meta.total}
            </b>{" "}
            {t("cabinet.ordersCountWord", { count: meta.total })}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-[10px]">
        {orders.map((order) => (
          <OrderListCard key={order.id} order={order} />
        ))}
      </div>

      {meta && (
        <OrdersPager
          page={page}
          lastPage={meta.lastPage}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
