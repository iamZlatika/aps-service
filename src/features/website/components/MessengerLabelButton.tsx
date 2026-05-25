import { type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

interface MessengerLabelButtonProps {
  icon: ReactNode;
  label: string;
  colorClass: string;
  href: string;
  onClick?: () => void;
}

export const MessengerLabelButton = ({
  icon,
  label,
  colorClass,
  href,
  onClick,
}: MessengerLabelButtonProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={onClick}
    className={cn(
      "flex flex-1 items-center justify-center gap-[5px] rounded-ws-sm border border-ws-line bg-white/[0.015] px-2 py-3 text-ws-xs font-semibold no-underline [&>svg]:size-4",
      colorClass,
    )}
  >
    {icon}
    {label}
  </a>
);
