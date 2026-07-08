import {
  BookOpenText,
  CreditCard,
  Images,
  MessageSquare,
  Package,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { BILLING_LINKS } from "@/features/backoffice/modules/billing/navigation.ts";
import { CUSTOMERS_LINKS } from "@/features/backoffice/modules/customers/navigation";
import { DICTIONARIES_LINKS } from "@/features/backoffice/modules/dictionaries/navigation";
import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation";
import { ROLES_PERMISSIONS_LINKS } from "@/features/backoffice/modules/roles-permissions/navigation.ts";
import { SMS_INTEGRATION_LINKS } from "@/features/backoffice/modules/sms-integration/navigation.ts";
import { USERS_LINKS } from "@/features/backoffice/modules/users/navigation";
import { WORKS_LINKS } from "@/features/backoffice/modules/works/navigation";
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
  useSidebar,
} from "@/shared/components/ui/sidebar";

export const Sidebar = memo(() => {
  const { t } = useTranslation();
  const { can } = useAuth();
  const { isMobile, setOpenMobile } = useSidebar();

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarRoot>
      <SidebarHeader className="p-4">
        <Link
          to={ORDERS_LINKS.root()}
          onClick={closeMobileSidebar}
          className="font-bold text-xl uppercase tracking-wider text-primary"
        >
          APS Service
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.management")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t("sidebar.orders")}>
                  <Link to={ORDERS_LINKS.root()} onClick={closeMobileSidebar}>
                    <Package className="h-4 w-4" />
                    <span>{t("sidebar.orders")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t("sidebar.customers")}>
                  <Link
                    to={CUSTOMERS_LINKS.root()}
                    onClick={closeMobileSidebar}
                  >
                    <Users className="h-4 w-4" />
                    <span>{t("sidebar.customers")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t("sidebar.masters")}>
                  <Link to={USERS_LINKS.root()} onClick={closeMobileSidebar}>
                    <Wrench className="h-4 w-4" />
                    <span>{t("sidebar.masters")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t("sidebar.dictionaries")}>
                  <Link
                    to={DICTIONARIES_LINKS.root()}
                    onClick={closeMobileSidebar}
                  >
                    <BookOpenText className="h-4 w-4" />
                    <span>{t("sidebar.dictionaries")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t("sidebar.works")}>
                  <Link to={WORKS_LINKS.root()} onClick={closeMobileSidebar}>
                    <Images className="h-4 w-4" />
                    <span>{t("sidebar.works")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {can("billing_view") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={t("sidebar.billing")}>
                    <Link
                      to={BILLING_LINKS.balances()}
                      onClick={closeMobileSidebar}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>{t("sidebar.billing")}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {can("integrations_sms_view") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={t("sidebar.sms_integration")}
                  >
                    <Link
                      to={SMS_INTEGRATION_LINKS.root()}
                      onClick={closeMobileSidebar}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{t("sidebar.sms_integration")}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {can("users_roles_permissions_manage") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={t("sidebar.roles_permissions")}
                  >
                    <Link
                      to={ROLES_PERMISSIONS_LINKS.root()}
                      onClick={closeMobileSidebar}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>{t("sidebar.roles_permissions")}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarRoot>
  );
});
