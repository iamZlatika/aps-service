import i18next from "i18next";
import { Link } from "react-router-dom";

import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation.ts";
import {
  type Referral,
  type ReferralTransaction,
} from "@/features/backoffice/modules/referrals/types.ts";
import { type ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { StatusBadge } from "@/shared/components/common/StatusBadge.tsx";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar.tsx";
import { formatDateTime } from "@/shared/lib/utils.ts";
import { type StatusColor, type TransactionStatus } from "@/shared/types.ts";

const TRANSACTION_STATUS_COLORS: Record<TransactionStatus, StatusColor> = {
  completed: "green",
  pending: "gray",
  rejected: "gray",
};

export function buildReferralColumns(): ColumnConfig<Referral>[] {
  return [
    {
      key: "customer",
      field: "customer",
      labelKey: "referrals.table.customer",
      sortable: false,
      renderCell: (value) => {
        const customer = value as Referral["customer"];
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={customer.avatarUrl} alt={customer.name} />
            </Avatar>
            <span>{customer.name}</span>
          </div>
        );
      },
    },
    {
      key: "commissionPercent",
      field: "commissionPercent",
      labelKey: "referrals.table.commission_percent",
      sortable: true,
      sortKey: "commission_percent",
      renderCell: (value) => `${value as number}%`,
    },
    {
      key: "balance",
      field: "balance",
      labelKey: "referrals.table.balance",
      sortable: false,
      renderCell: (value) => <MoneyAmount value={value as string} />,
    },
    {
      key: "pendingBalance",
      field: "pendingBalance",
      labelKey: "referrals.table.pending_balance",
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
      key: "createdBy",
      field: "createdBy",
      labelKey: "referrals.table.created_by",
      sortable: false,
      renderCell: (value) => (value as Referral["createdBy"])?.name ?? "—",
    },
    {
      key: "createdAt",
      field: "createdAt",
      labelKey: "referrals.table.created_at",
      sortable: true,
      sortKey: "created_at",
      renderCell: (value) => formatDateTime(value as string),
    },
  ];
}

export function buildReferralTransactionColumns(): ColumnConfig<ReferralTransaction>[] {
  return [
    {
      key: "createdAt",
      field: "createdAt",
      labelKey: "referrals.transactions.table.date",
      sortable: true,
      sortKey: "created_at",
      renderCell: (value) => formatDateTime(value as string),
    },
    {
      key: "type",
      field: "type",
      labelKey: "referrals.transactions.table.type",
      sortable: true,
      renderCell: (value) =>
        i18next.t(`billing.transaction_types.${value as string}`),
    },
    {
      key: "label",
      field: "label",
      labelKey: "referrals.transactions.table.label",
      sortable: false,
    },
    {
      key: "amount",
      field: "amount",
      labelKey: "referrals.transactions.table.amount",
      sortable: true,
      renderCell: (value) => <MoneyAmount value={value as string} />,
    },
    {
      key: "status",
      field: "status",
      labelKey: "referrals.transactions.table.status",
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
    },
    {
      key: "order",
      field: "orderNumber",
      labelKey: "referrals.transactions.table.order",
      sortable: false,
      renderCell: (_value, item) =>
        item.orderId ? (
          <Link
            to={ORDERS_LINKS.detail(item.orderId)}
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {item.orderNumber}
          </Link>
        ) : (
          "—"
        ),
    },
    {
      key: "createdBy",
      field: "createdBy",
      labelKey: "referrals.transactions.table.created_by",
      sortable: false,
      renderCell: (value) =>
        (value as ReferralTransaction["createdBy"])?.name ?? "—",
    },
  ];
}
