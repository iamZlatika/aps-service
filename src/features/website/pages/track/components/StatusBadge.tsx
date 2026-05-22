import { useTranslation } from "react-i18next";

import type { OrderStatus } from "@/shared/types";

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { i18n } = useTranslation();
  const name = i18n.language === "ru" ? status.nameRu : status.nameUa;

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-ws-sm font-semibold tracking-[0.005em]"
      style={{
        color: status.color,
        background: `color-mix(in oklab, ${status.color} 12%, transparent)`,
        borderColor: `color-mix(in oklab, ${status.color} 26%, transparent)`,
      }}
    >
      <span
        className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-current"
        style={{
          boxShadow: `0 0 0 3px color-mix(in oklab, ${status.color} 28%, transparent)`,
        }}
      />
      {name}
    </span>
  );
};
