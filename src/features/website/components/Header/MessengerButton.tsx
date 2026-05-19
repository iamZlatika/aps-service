import { type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

interface MessengerButtonProps {
  href: string;
  label: string;
  icon: ReactNode;
  hoverClass: string;
}

export const MessengerButton = ({
  href,
  label,
  icon,
  hoverClass,
}: MessengerButtonProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={cn(
      "inline-flex size-ws-ctrl items-center justify-center rounded-ws-ctrl border border-ws-line bg-white/[0.015] text-ws-ink-soft transition-all duration-200 hover:-translate-y-px [&>svg]:size-4",
      hoverClass,
    )}
  >
    {icon}
  </a>
);
