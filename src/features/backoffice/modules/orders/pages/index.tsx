import { CircleCheck } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import type { Customer } from "@/features/backoffice/modules/customers/types.ts";
import { AddButton } from "@/features/backoffice/modules/dictionaries/components/AddButton.tsx";
import { ordersApi } from "@/features/backoffice/modules/orders/api";
import { OrdersFilterBar } from "@/features/backoffice/modules/orders/components/OrdersFilterBar.tsx";
import { StatusSelect } from "@/features/backoffice/modules/orders/components/StatusSelect.tsx";
import { useIsUkLocale } from "@/features/backoffice/modules/orders/hooks/useIsUkLocale.ts";
import { renderWrappedText } from "@/features/backoffice/modules/orders/lib/cellFormatters.tsx";
import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation.ts";
import {
  type Order,
  type OrderStatus,
} from "@/features/backoffice/modules/orders/types.ts";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import { SmartTable } from "@/features/backoffice/widgets/table";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { PhoneDropdown } from "@/shared/components/common/PhoneDropdown.tsx";
import { useIsMobile } from "@/shared/hooks/useMobile.ts";

const isCustomer = (value: unknown): value is Customer =>
  typeof value === "object" && value !== null && "phones" in value;

const isUser = (value: unknown): value is User =>
  typeof value === "object" && value !== null && "role" in value;

const isOrderStatus = (value: unknown): value is OrderStatus =>
  typeof value === "object" &&
  value !== null &&
  "nameRu" in value &&
  "color" in value;

const OrdersPage = () => {
  const navigate = useNavigate();
  const isUk = useIsUkLocale();
  const locale = isUk ? "uk-UA" : "ru-RU";
  const isMobile = useIsMobile();

  const { columns, mobileColumns } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cols: ColumnConfig<Order>[] = [
      {
        key: "orderNumber",
        field: "orderNumber",
        labelKey: "orders.table_fields.number",
        sortable: false,
      },
      {
        key: "dueDate",
        field: "dueDate",
        labelKey: "orders.table_fields.due",
        sortable: false,
        renderCell: (value) => {
          const date = new Date(value as string);
          date.setHours(0, 0, 0, 0);
          const diffDays = Math.round(
            (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
          );
          const isOverdue = diffDays < 0;
          return (
            <div className="flex items-center gap-1">
              <span
                className={isOverdue ? "text-destructive font-semibold" : ""}
              >
                {Math.abs(diffDays)} дн.
              </span>
            </div>
          );
        },
      },
      {
        key: "status",
        field: "status",
        labelKey: "orders.table_fields.status",
        sortable: false,
        renderCell: (value, item) => {
          if (!isOrderStatus(value)) return null;
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <StatusSelect
                orderId={item.id}
                status={value}
                remainingToPay={item.remainingToPay}
              />
            </div>
          );
        },
      },
      {
        key: "updatedAt",
        field: "updatedAt",
        labelKey: "orders.table_fields.updated",
        sortable: false,
        renderCell: (value) => {
          const date = new Date(value as string);
          return (
            <div className="flex flex-col">
              <span>
                {`${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`}
              </span>
              <span className="text-muted-foreground text-sm">
                {date.toLocaleTimeString(locale, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            </div>
          );
        },
      },
      {
        key: "customerName",
        field: "customer",
        labelKey: "orders.table_fields.customer",
        sortable: false,
        renderCell: (value) => {
          if (!isCustomer(value)) return null;
          const primaryPhone = value.phones.find((p) => p.isPrimary);
          return (
            <div className="flex flex-col">
              <span>{value.name}</span>
              {primaryPhone && (
                <PhoneDropdown phoneNumber={primaryPhone.phoneNumber} />
              )}
            </div>
          );
        },
      },
      {
        key: "manager",
        field: "manager",
        labelKey: "orders.table_fields.manager",
        sortable: false,
        renderCell: (value) => {
          if (!isUser(value)) return null;
          return (
            <div className="flex flex-col">
              <span>{value.name}</span>
            </div>
          );
        },
      },
      {
        key: "totalCost",
        field: "totalCost",
        labelKey: "orders.table_fields.totalCost",
        sortable: false,
        renderCell: (value) => <span>{value as string} ₴</span>,
      },
      {
        key: "deviceType",
        field: "deviceType",
        labelKey: "orders.table_fields.deviceType",
        sortable: false,
      },
      {
        key: "manufacturer",
        field: "manufacturer",
        labelKey: "orders.table_fields.manufacturer",
        sortable: false,
      },
      {
        key: "deviceModel",
        field: "deviceModel",
        labelKey: "orders.table_fields.deviceModel",
        sortable: false,
        renderCell: renderWrappedText,
      },
      {
        key: "accessory",
        field: "accessory",
        labelKey: "orders.table_fields.accessory",
        sortable: false,
        renderCell: renderWrappedText,
      },
      {
        key: "issueType",
        field: "issueType",
        labelKey: "orders.table_fields.issueType",
        sortable: false,
        renderCell: renderWrappedText,
      },
      {
        key: "intakeNote",
        field: "intakeNote",
        labelKey: "orders.table_fields.intakeNote",
        sortable: false,
        renderCell: renderWrappedText,
      },
      {
        key: "estimatedCost",
        field: "estimatedCost",
        labelKey: "orders.table_fields.estimatedCost",
        sortable: false,
        renderCell: (value) => <span>{value as string} ₴</span>,
      },
      {
        key: "isCalled",
        field: "isCalled",
        labelKey: "orders.table_fields.isCalled",
        sortable: false,
        renderCell: (value) =>
          value ? (
            <CircleCheck className="text-green-600 size-6" />
          ) : (
            <span>—</span>
          ),
      },
      {
        key: "isUrgent",
        field: "isUrgent",
        labelKey: "orders.table_fields.isUrgent",
        sortable: false,
        renderCell: (value) =>
          value ? (
            <CircleCheck className="text-green-600 size-6" />
          ) : (
            <span>—</span>
          ),
      },
    ];

    const mobileCols = (
      [
        "orderNumber",
        "status",
        "deviceType",
        "deviceModel",
        "customerName",
      ] as const
    ).map((key) => cols.find((col) => col.key === key)!);

    return { columns: cols, mobileColumns: mobileCols };
  }, [locale]);

  const onRowClick = useCallback(
    (order: Order) => navigate(`/backoffice/orders/${order.id}`),
    [navigate],
  );
  return (
    <SmartTable
      className="max-w-[2560px] lg:max-w-[2560px]"
      titleKey="breadcrumbs.orders"
      api={ordersApi}
      queryKeyFn={queryKeys.orders.list}
      searchPlaceholder="search_placeholders.orders_any_match"
      searchField="search"
      columns={isMobile ? mobileColumns : columns}
      headerActions={
        <AddButton onClick={() => navigate(ORDERS_LINKS.newOrder())} />
      }
      onRowClick={onRowClick}
      extraFilterKeys={[
        "location_id",
        "status_id",
        "status_ids[]",
        "is_urgent",
      ]}
      filterBar={<OrdersFilterBar />}
    />
  );
};

export default OrdersPage;
