import { useTranslation } from "react-i18next";

import type { OrderStatusSnapshot } from "../../types.ts";

// The legend dots need a literal color value (inline style), not the Tailwind
// classes StatusBadge uses (shared/lib/constants.ts statusColorMap). These are the
// hex equivalents of that same 11-color status palette (per
// .claude/docs/STATISTICS.md §5) — kept local since nothing else needs literal hex
// for status colors.
const STATUS_HEX_MAP: Record<string, string> = {
  red: "#ef4444",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  violet: "#8b5cf6",
  blue: "#3b82f6",
  sky: "#0ea5e9",
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  black: "#111827",
  gray: "#6b7280",
};
const FALLBACK_COLOR = STATUS_HEX_MAP.gray;

interface OrdersStatusListProps {
  statusSnapshot: OrderStatusSnapshot[];
}

export const OrdersStatusList = ({ statusSnapshot }: OrdersStatusListProps) => {
  const { t } = useTranslation();

  return (
    <ul className="flex flex-col gap-1.5 text-sm">
      <li className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
        {t("statistics.now_label")}
      </li>
      {statusSnapshot.map((status) => (
        <li key={status.key} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{
              backgroundColor:
                (status.color && STATUS_HEX_MAP[status.color]) ??
                FALLBACK_COLOR,
            }}
          />
          <span className="flex-1">{status.name}</span>
          <span className="font-medium">{status.count}</span>
        </li>
      ))}
    </ul>
  );
};
