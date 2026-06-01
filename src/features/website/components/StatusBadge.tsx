import { useLocalizedName } from "@/shared/hooks/useLocalizedName";
import type { OrderStatus } from "@/shared/types";

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getLocalizedName = useLocalizedName();
  const name = getLocalizedName(status);

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--ws-ember)_26%,transparent)] bg-[color-mix(in_oklab,var(--ws-ember)_12%,transparent)] px-3.5 py-2 text-ws-sm font-semibold tracking-[0.005em] text-ws-ember-bright">
      <span
        className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-current"
        style={{
          boxShadow:
            "0 0 0 3px color-mix(in oklab, var(--ws-ember) 28%, transparent)",
        }}
      />
      {name}
    </span>
  );
};
