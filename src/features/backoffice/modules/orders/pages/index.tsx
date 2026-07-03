import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { AddButton } from "@/features/backoffice/components/AddButton";
import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { OrdersFilterBar } from "@/features/backoffice/modules/orders/components/OrdersFilterBar.tsx";
import { useIsUkLocale } from "@/features/backoffice/modules/orders/hooks/useIsUkLocale.ts";
import { useOrdersSocket } from "@/features/backoffice/modules/orders/hooks/useOrdersSocket.ts";
import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation.ts";
import { type Order } from "@/features/backoffice/modules/orders/types.ts";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { useIsMobile } from "@/shared/hooks/useMobile.ts";

import { buildOrderColumns } from "./columns";

const OrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationSearchRef = useRef(location.search);
  const isUk = useIsUkLocale();
  const locale = isUk ? "uk-UA" : "ru-RU";
  const isMobile = useIsMobile();
  const { can } = useAuth();
  const canManage = can("orders_manage");

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
