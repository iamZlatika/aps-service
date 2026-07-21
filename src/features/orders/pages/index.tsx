import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ABILITIES } from "@/features/auth/abilities.ts";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { ordersApi } from "@/features/orders/api";
import { OrdersFilterBar } from "@/features/orders/components/OrdersFilterBar.tsx";
import { useIsUkLocale } from "@/features/orders/hooks/useIsUkLocale.ts";
import { useOrdersSocket } from "@/features/orders/hooks/useOrdersSocket.ts";
import { ORDERS_LINKS } from "@/features/orders/navigation.ts";
import { type Order } from "@/features/orders/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { AddButton } from "@/shared/components/AddButton";
import { useIsMobile } from "@/shared/hooks/useMobile.ts";
import { SmartTable } from "@/widgets/table";

import { buildOrderColumns } from "./columns";

const OrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationSearchRef = useRef(location.search);
  const isUk = useIsUkLocale();
  const locale = isUk ? "uk-UA" : "ru-RU";
  const isMobile = useIsMobile();
  const { can } = useAuth();
  const canManage = can(ABILITIES.ORDERS_MANAGE);

  useOrdersSocket();

  useEffect(() => {
    locationSearchRef.current = location.search;
  }, [location.search]);

  const { columns, mobileColumns } = useMemo(
    () => buildOrderColumns(locale),
    [locale],
  );

  const onRowClick = useCallback(
    (order: Order) =>
      navigate(ORDERS_LINKS.detail(order.id), {
        state: { back: locationSearchRef.current },
      }),
    [navigate],
  );

  return (
    <SmartTable
      className="max-w-[2560px] lg:max-w-[2560px]"
      titleKey="breadcrumbs.orders"
      api={ordersApi}
      queryKeyFn={queryKeys.orders.list}
      searchPlaceholder={
        isMobile
          ? "search_placeholders.orders_any_match_mobile"
          : "search_placeholders.orders_any_match"
      }
      searchInputClassName={
        isMobile ? "mb-0 flex-none w-44" : "mb-0 flex-none w-56 sm:w-[30rem]"
      }
      searchField="search"
      columns={isMobile ? mobileColumns : columns}
      headerActions={
        canManage ? (
          <AddButton onClick={() => navigate(ORDERS_LINKS.newOrder())} />
        ) : undefined
      }
      onRowClick={onRowClick}
      extraFilterKeys={[
        "location_id",
        "status_id",
        "status_ids[]",
        "is_urgent",
        "manager_id",
        "any_match",
      ]}
      filterBar={<OrdersFilterBar />}
    />
  );
};

export default OrdersPage;
