import { type ReactNode } from "react";

interface OrderSectionCardProps {
  icon: ReactNode;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}

export const OrderSectionCard = ({
  icon,
  title,
  aside,
  children,
}: OrderSectionCardProps) => (
  <div className="overflow-hidden rounded-[18px] border border-ws-line bg-ws-card">
    <div className="flex items-center justify-between gap-3 border-b border-ws-line-soft px-[22px] py-[18px]">
      <h3 className="flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[.1em] text-ws-ink">
        <span className="text-ws-ember-bright">{icon}</span>
        {title}
      </h3>
      {aside && (
        <span className="text-[13px] font-semibold tabular-nums text-ws-ink-soft">
          {aside}
        </span>
      )}
    </div>
    <div className="px-[22px] py-2">{children}</div>
  </div>
);
