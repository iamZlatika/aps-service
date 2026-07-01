import { Flame, PhoneOff, PhoneOutgoing } from "lucide-react";

import { PhoneDropdown } from "@/features/backoffice/components/PhoneDropdown";
import type { Customer } from "@/features/backoffice/modules/customers/types.ts";
import { StatusSelect } from "@/features/backoffice/modules/orders/components/StatusSelect.tsx";
import { renderWrappedText } from "@/features/backoffice/modules/orders/lib/cellFormatters.tsx";
import {
  type Order,
  type OrderStatus,
} from "@/features/backoffice/modules/orders/types.ts";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";

const isCustomer = (value: unknown): value is Customer =>
  typeof value === "object" && value !== null && "phones" in value;

const isUser = (value: unknown): value is User =>
  typeof value === "object" && value !== null && "role" in value;

const isOrderStatus = (value: unknown): value is OrderStatus =>
  typeof value === "object" &&
  value !== null &&
  "nameRu" in value &&
  "color" in value;

export function buildOrderColumns(locale: string): {
  columns: ColumnConfig<Order>[];
  mobileColumns: ColumnConfig<Order>[];
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const columns: ColumnConfig<Order>[] = [
    {
      key: "orderNumber",
      field: "orderNumber",
      labelKey: "orders.table_fields.number",
      sortable: false,
      renderCell: (value, item) => (
        <div className="flex flex-col items-center justify-center gap-0.5 pr-4">
          <span>{value as string}</span>
          <div className="flex items-center gap-1">
            {item.isCalled ? (
              <PhoneOutgoing className="size-4 text-green-600" />
            ) : (
              <PhoneOff className="size-4 text-red-600" />
            )}
            {item.isUrgent && (
              <Flame className="size-4 text-red-600 fill-red-600" />
            )}
          </div>
        </div>
      ),
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
            <span className={isOverdue ? "text-destructive font-semibold" : ""}>
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
          <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
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
      renderCell: renderWrappedText,
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
      renderCell: (value) => (value ? renderWrappedText(value) : null),
    },
  ];

  const mobileColumns = (
    [
      "orderNumber",
      "status",
      "deviceType",
      "deviceModel",
      "customerName",
    ] as const
  ).map((key) => {
    const col = columns.find((c) => c.key === key);
    if (!col)
      throw new Error(`Mobile column "${key}" not found in columns config`);
    return col;
  });

  return { columns, mobileColumns };
}
