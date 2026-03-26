import {
  BookOpenText,
  ChevronDown,
  Package,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { AuthRoutes } from "@/features/auth/api/routes.ts";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { CUSTOMERS_ROUTES } from "@/features/backoffice/modules/customers/routes";
import { DICTIONARIES_LINKS } from "@/features/backoffice/modules/dictionaries/navigation";
import { ORDERS_ROUTES } from "@/features/backoffice/modules/orders/routes";
import { USERS_ROUTES } from "@/features/backoffice/modules/users/routes";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { ROLES } from "@/shared/types.ts";

export const Sidebar = memo(() => {
  const { t } = useTranslation();
  const { role } = useAuth();
  const { isMobile, setOpenMobile } = useSidebar();
  const isHeadManager = role === ROLES.HEAD_MANAGER;

  const root = AuthRoutes.backofficeRoot();

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  return (
    <SidebarRoot>
      <SidebarHeader className="p-4">
        <div className="font-bold text-xl uppercase tracking-wider text-primary">
          APS Service
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.management")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t("sidebar.orders")}>
                  <Link
                    to={`${root}/${ORDERS_ROUTES.root}`}
                    onClick={closeMobileSidebar}
                  >
                    <Package className="h-4 w-4" />
                    <span>{t("sidebar.orders")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t("sidebar.customers")}>
                  <Link
                    to={`${root}/${CUSTOMERS_ROUTES.root}`}
                    onClick={closeMobileSidebar}
                  >
                    <Users className="h-4 w-4" />
                    <span>{t("sidebar.customers")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isHeadManager && (
                <Collapsible className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={t("sidebar.settings")}>
                        <Settings className="h-4 w-4" />
                        <span>{t("sidebar.settings")}</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link
                              to={`${root}/${USERS_ROUTES.root}`}
                              onClick={closeMobileSidebar}
                            >
                              <Wrench className="h-4 w-4" />
                              <span>{t("sidebar.masters")}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link
                              to={DICTIONARIES_LINKS.root()}
                              onClick={closeMobileSidebar}
                            >
                              <BookOpenText className="h-4 w-4" />
                              <span>{t("sidebar.dictionaries")}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarRoot>
  );
});
