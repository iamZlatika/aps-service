import { type Location } from "@/entities/location/types.ts";
import { type QuickOrder } from "@/features/quick-orders/types.ts";
import { type User } from "@/features/users/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { formatDate } from "@/shared/lib/utils.ts";
import { type ColumnConfig } from "@/widgets/table/models/types.ts";

export function buildQuickOrderColumns(): ColumnConfig<QuickOrder>[] {
  return [
    {
      key: "number",
      field: "number",
      labelKey: "quickOrders.table_fields.number",
      sortable: true,
    },
    {
      key: "manager",
      field: "manager",
      labelKey: "quickOrders.table_fields.manager",
      sortable: false,
      renderCell: (value) => (value as User).name,
    },
    {
      key: "location",
      field: "location",
      labelKey: "quickOrders.table_fields.location",
      sortable: false,
      renderCell: (value) => (value as Location | null)?.name ?? "—",
    },
    {
      key: "totalPrice",
      field: "totalPrice",
      labelKey: "quickOrders.table_fields.totalPrice",
      sortable: true,
      sortKey: "total_price",
      renderCell: (value) => <MoneyAmount value={value as string} />,
    },
    {
      key: "createdAt",
      field: "createdAt",
      labelKey: "quickOrders.table_fields.createdAt",
      sortable: true,
      sortKey: "created_at",
      renderCell: (value) => formatDate(value as string),
    },
  ];
}
