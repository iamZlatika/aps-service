import {
  BarChart3,
  BookOpenText,
  CreditCard,
  Handshake,
  Images,
  MessageSquare,
  Package,
  ShieldCheck,
  ShoppingCart,
  Users,
  Wrench,
} from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ABILITIES } from "@/features/auth/abilities.ts";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { BILLING_LINKS } from "@/features/billing/navigation.ts";
import { CUSTOMERS_LINKS } from "@/features/customers/navigation";
import { DICTIONARIES_LINKS } from "@/features/dictionaries/navigation";
import { ORDERS_LINKS } from "@/features/orders/navigation";
import { QUICK_ORDERS_LINKS } from "@/features/quick-orders/navigation.ts";
import { REFERRALS_LINKS } from "@/features/referrals/navigation.ts";
import { ROLES_PERMISSIONS_LINKS } from "@/features/roles-permissions/navigation.ts";
import { SMS_INTEGRATION_LINKS } from "@/features/sms-integration/navigation.ts";
import { STATISTICS_LINKS } from "@/features/statistics/navigation.ts";
import { USERS_LINKS } from "@/features/users/navigation";
import { WORKS_LINKS } from "@/features/works/navigation";
import { SidebarNavItem } from "@/shared/components/common/SidebarNavItem.tsx";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
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
          <SidebarGroupLabel>{t("sidebar.groups.orders")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem
                to={ORDERS_LINKS.root()}
                icon={Package}
                label={t("sidebar.orders")}
                onClick={closeMobileSidebar}
              />
              {can(ABILITIES.QUICK_ORDERS_MANAGE) && (
                <SidebarNavItem
                  to={QUICK_ORDERS_LINKS.root()}
                  icon={ShoppingCart}
                  label={t("sidebar.quick_orders")}
                  onClick={closeMobileSidebar}
                />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.groups.customers")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem
                to={CUSTOMERS_LINKS.root()}
                icon={Users}
                label={t("sidebar.customers")}
                onClick={closeMobileSidebar}
              />
              {can(ABILITIES.REFERRALS_MANAGE) && (
                <SidebarNavItem
                  to={REFERRALS_LINKS.root()}
                  icon={Handshake}
                  label={t("sidebar.referrals")}
                  onClick={closeMobileSidebar}
                />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.management")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem
                to={USERS_LINKS.root()}
                icon={Wrench}
                label={t("sidebar.masters")}
                onClick={closeMobileSidebar}
              />
              {can(ABILITIES.BILLING_VIEW) && (
                <SidebarNavItem
                  to={BILLING_LINKS.balances()}
                  icon={CreditCard}
                  label={t("sidebar.billing")}
                  onClick={closeMobileSidebar}
                />
              )}
              {can(ABILITIES.USERS_ROLES_PERMISSIONS_MANAGE) && (
                <SidebarNavItem
                  to={ROLES_PERMISSIONS_LINKS.root()}
                  icon={ShieldCheck}
                  label={t("sidebar.roles_permissions")}
                  onClick={closeMobileSidebar}
                />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar.misc")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavItem
                to={DICTIONARIES_LINKS.root()}
                icon={BookOpenText}
                label={t("sidebar.dictionaries")}
                onClick={closeMobileSidebar}
              />
              <SidebarNavItem
                to={WORKS_LINKS.root()}
                icon={Images}
                label={t("sidebar.works")}
                onClick={closeMobileSidebar}
              />
              {can(ABILITIES.INTEGRATIONS_SMS_VIEW) && (
                <SidebarNavItem
                  to={SMS_INTEGRATION_LINKS.root()}
                  icon={MessageSquare}
                  label={t("sidebar.sms_integration")}
                  onClick={closeMobileSidebar}
                />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {can(ABILITIES.STATISTICS_VIEW) && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarNavItem
                    to={STATISTICS_LINKS.root()}
                    icon={BarChart3}
                    label={t("sidebar.statistics")}
                    onClick={closeMobileSidebar}
                  />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </SidebarRoot>
  );
});
