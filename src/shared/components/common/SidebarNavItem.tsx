import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

interface SidebarNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export const SidebarNavItem = ({
  to,
  icon: Icon,
  label,
  onClick,
}: SidebarNavItemProps) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild tooltip={label}>
      <Link to={to} onClick={onClick}>
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);
