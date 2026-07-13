import i18next from "i18next";
import { CircleCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { CUSTOMERS_LINKS } from "@/features/backoffice/modules/customers/navigation.ts";
import { type Customer } from "@/features/backoffice/modules/customers/types.ts";
import { SMS_STATUS_COLORS } from "@/features/backoffice/modules/sms-integration/lib/constants.ts";
import { type SmsMessage } from "@/features/backoffice/modules/sms-integration/types.ts";
import { type ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { StatusBadge } from "@/shared/components/common/StatusBadge.tsx";
import { formatDateTime } from "@/shared/lib/utils.ts";
import { type SmsMessageStatus } from "@/shared/types.ts";

const isCustomer = (value: unknown): value is Customer =>
  typeof value === "object" && value !== null && "phones" in value;

export function buildSmsMessageColumns(): ColumnConfig<SmsMessage>[] {
  return [
    {
      key: "sentAt",
      field: "sentAt",
      labelKey: "smsIntegration.messages.table.date",
      sortable: false,
      renderCell: (value) => formatDateTime(value as string | null) ?? "—",
    },
    {
      key: "phone",
      field: "phone",
      labelKey: "smsIntegration.messages.table.phone",
      sortable: false,
    },
    {
      key: "customer",
      field: "customer",
      labelKey: "smsIntegration.messages.table.customer",
      sortable: false,
      renderCell: (value) =>
        isCustomer(value) ? (
          <Link
            to={CUSTOMERS_LINKS.detail(value.id)}
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {value.name}
          </Link>
        ) : (
          "—"
        ),
    },
    {
      key: "text",
      field: "text",
      labelKey: "smsIntegration.messages.table.text",
      sortable: false,
      renderCell: (value) => (
        <span className="block max-w-[35ch] whitespace-normal">
          {value as string}
        </span>
      ),
    },
    {
      key: "status",
      field: "status",
      labelKey: "smsIntegration.messages.table.status",
      sortable: true,
      renderCell: (value) => {
        const status = value as SmsMessageStatus;
        return (
          <StatusBadge
            name={i18next.t(`smsIntegration.messages.statuses.${status}`)}
            color={SMS_STATUS_COLORS[status]}
          />
        );
      },
    },
    {
      key: "provider",
      field: "provider",
      labelKey: "smsIntegration.messages.table.provider",
      sortable: false,
      renderCell: (value) =>
        i18next.t(`smsIntegration.messages.providers.${value as string}`),
    },
    {
      key: "deliveredAt",
      field: "deliveredAt",
      labelKey: "smsIntegration.messages.table.delivered_at",
      sortable: false,
      renderCell: (value) =>
        value ? (
          <CircleCheck
            className="h-4 w-4 text-green-600"
            aria-label={i18next.t("smsIntegration.messages.table.delivered_at")}
          />
        ) : (
          "—"
        ),
    },
  ];
}
