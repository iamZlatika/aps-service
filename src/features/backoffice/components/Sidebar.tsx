import {
  BookOpenText,
  CreditCard,
  Images,
  Package,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { AuthRoutes } from "@/features/auth/backoffice/api/routes.ts";
import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { BILLING_LINKS } from "@/features/backoffice/modules/billing/navigation.ts";
import { CUSTOMERS_ROUTES } from "@/features/backoffice/modules/customers/routes";
import { DICTIONARIES_LINKS } from "@/features/backoffice/modules/dictionaries/navigation";
import { ORDERS_ROUTES } from "@/features/backoffice/modules/orders/routes";
import { ROLES_PERMISSIONS_LINKS } from "@/features/backoffice/modules/roles-permissions/navigation.ts";
import { USERS_ROUTES } from "@/features/backoffice/modules/users/routes";
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

              {can("users_view") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={t("sidebar.masters")}>
                    <Link
                      to={`${root}/${USERS_ROUTES.root}`}
                      onClick={closeMobileSidebar}
                    >
                      <Wrench className="h-4 w-4" />
                      <span>{t("sidebar.masters")}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {can("dictionaries_services_view") && (
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
              )}

              {can("landing_works_view") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={t("sidebar.works")}>
                    <Link
                      to={WORKS_LINKS.root()}
                      onClick={closeMobileSidebar}
                    >
                      <Images className="h-4 w-4" />
                      <span>{t("sidebar.works")}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {can("billing_view") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={t("sidebar.billing")}>
                    <Link
                      to={BILLING_LINKS.root()}
                      onClick={closeMobileSidebar}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>{t("sidebar.billing")}</span>
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
