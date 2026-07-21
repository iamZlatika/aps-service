import i18next from "i18next";
import { Link } from "react-router-dom";

import { TRANSACTION_STATUS_COLORS } from "@/features/billing/lib/constants.ts";
import { type Balance, type Transaction } from "@/features/billing/types.ts";
import {
  renderWrappedText,
  renderWrappedTextMultiline,
} from "@/features/orders/lib/cellFormatters.tsx";
import { ORDERS_LINKS } from "@/features/orders/navigation.ts";
import { RoleBadge } from "@/features/profile/components/RoleBadge.tsx";
import { QUICK_ORDERS_LINKS } from "@/features/quick-orders/navigation.ts";
import { type User } from "@/features/users/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { StatusBadge } from "@/shared/components/common/StatusBadge.tsx";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar.tsx";
import { formatDateTime } from "@/shared/lib/utils.ts";
import { TRANSACTION_TYPES, type TransactionStatus } from "@/shared/types.ts";
import { type ColumnConfig } from "@/widgets/table/models/types.ts";

const isUser = (value: unknown): value is User =>
  typeof value === "object" && value !== null && "email" in value;

// Shared by buildTransactionColumns and buildMyTransactionColumns — both render
// the same order/amount/date/type/status columns, just with a different mix of
// extra columns around them.
function buildOrderColumn(): ColumnConfig<Transaction> {
  return {
    key: "order",
    field: "orderNumber",
    labelKey: "billing.transactions.table.order",
    sortable: false,
    renderCell: (_value, item) => {
      if (item.orderId) {
        return (
          <Link
            to={ORDERS_LINKS.detail(item.orderId)}
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {item.orderNumber}
          </Link>
        );
      }
      if (item.quickOrderId) {
        return (
          <Link
            to={QUICK_ORDERS_LINKS.detail(item.quickOrderId)}
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {item.quickOrderNumber}
          </Link>
        );
      }
      return "—";
    },
  };
}

function buildAmountColumn(): ColumnConfig<Transaction> {
  return {
    key: "amount",
    field: "amount",
    labelKey: "billing.transactions.table.amount",
    sortable: true,
    renderCell: (value) => <MoneyAmount value={value as string} />,
  };
}

function buildCreatedAtColumn(): ColumnConfig<Transaction> {
  return {
    key: "createdAt",
    field: "createdAt",
    labelKey: "billing.transactions.table.date",
    sortable: true,
    sortKey: "created_at",
    renderCell: (value) => formatDateTime(value as string),
  };
}

function buildTypeColumn(): ColumnConfig<Transaction> {
  return {
    key: "type",
    field: "type",
    labelKey: "billing.transactions.table.type",
    sortable: true,
    renderCell: (value) =>
      i18next.t(`billing.transaction_types.${value as string}`),
  };
}

function buildStatusColumn(): ColumnConfig<Transaction> {
  return {
    key: "status",
    field: "status",
    labelKey: "billing.transactions.table.status",
    sortable: true,
    renderCell: (value) => {
      const status = value as TransactionStatus;
      return (
        <StatusBadge
          name={i18next.t(`billing.transaction_statuses.${status}`)}
          color={TRANSACTION_STATUS_COLORS[status]}
        />
      );
    },
  };
}

export function buildBalanceColumns(): ColumnConfig<Balance>[] {
  return [
    {
      key: "employee",
      field: "user",
      labelKey: "billing.balances.employee",
      sortable: true,
      sortKey: "user_id",
      renderCell: (value) => {
        if (!isUser(value)) return null;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={value.avatarUrl} alt={value.name} />
            </Avatar>
            <span>{value.name}</span>
          </div>
        );
      },
    },
    {
      key: "roles",
      field: "user",
      labelKey: "billing.balances.roles",
      sortable: false,
      renderCell: (value) =>
        isUser(value) ? <RoleBadge roles={value.roles} /> : null,
    },
    {
      key: "amount",
      field: "amount",
      labelKey: "billing.balances.balance",
      sortable: true,
      renderCell: (value) => <MoneyAmount value={value as string} />,
    },
    {
      key: "pendingAmount",
      field: "pendingAmount",
      labelKey: "billing.balances.pending_amount",
      sortable: false,
      renderCell: (value) => {
        const raw = value as string;
        if (raw === "0") {
          return <span className="text-muted-foreground">—</span>;
        }
        return (
          <MoneyAmount
            value={raw}
            className="text-muted-foreground"
            prefix="+ "
          />
        );
      },
    },
    {
      key: "updatedAt",
      field: "updatedAt",
      labelKey: "billing.balances.updated",
      sortable: true,
      sortKey: "created_at",
      renderCell: (value) => formatDateTime(value as string),
    },
  ];
}

const LABEL_COLUMN_WRAP_AT = 60;

export function buildTransactionColumns({
  showEmployeeColumn,
}: {
  showEmployeeColumn: boolean;
}): ColumnConfig<Transaction>[] {
  const columns: ColumnConfig<Transaction>[] = [
    buildCreatedAtColumn(),
    buildTypeColumn(),
    {
      key: "label",
      field: "label",
      labelKey: "billing.transactions.table.label",
      sortable: false,
      renderCell: (value) =>
        renderWrappedTextMultiline(value, { wrapAt: LABEL_COLUMN_WRAP_AT }),
    },
    buildAmountColumn(),
    buildStatusColumn(),
    buildOrderColumn(),
    {
      key: "createdBy",
      field: "createdBy",
      labelKey: "billing.transactions.table.created_by",
      sortable: false,
      renderCell: (value) =>
        isUser(value)
          ? value.name
          : i18next.t("billing.transactions.system_auto"),
    },
  ];

  if (showEmployeeColumn) {
    columns.splice(1, 0, {
      key: "employee",
      field: "user",
      labelKey: "billing.transactions.table.employee",
      sortable: false,
      renderCell: (value, item) =>
        item.referral
          ? item.referral.customer.name
          : isUser(value)
            ? value.name
            : i18next.t("billing.transactions.system"),
    });
  }

  return columns;
}

const ITEM_COLUMN_WRAP_AT = 45;
const ITEM_COLUMN_MAX_CHARS = 90;

export function buildMyTransactionColumns(): ColumnConfig<Transaction>[] {
  return [
    buildOrderColumn(),
    {
      key: "item",
      field: "orderService",
      labelKey: "billing.transactions.table.item",
      sortable: false,
      renderCell: (_value, item) => {
        const text =
          item.orderService?.name ??
          item.orderProduct?.name ??
          (item.type === TRANSACTION_TYPES.MANUAL_ADJUSTMENT ||
          item.type === TRANSACTION_TYPES.WITHDRAWAL_REQUEST
            ? item.label
            : "—");
        return renderWrappedText(text, {
          wrapAt: ITEM_COLUMN_WRAP_AT,
          maxChars: ITEM_COLUMN_MAX_CHARS,
        });
      },
    },
    buildAmountColumn(),
    buildCreatedAtColumn(),
    buildTypeColumn(),
    buildStatusColumn(),
  ];
}
