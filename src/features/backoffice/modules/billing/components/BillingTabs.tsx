import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import { BILLING_LINKS } from "@/features/backoffice/modules/billing/navigation.ts";
import { cn } from "@/shared/lib/utils.ts";

interface BillingTabProps {
  label: string;
  to: string;
  active: boolean;
}

const BillingTab = ({ label, to, active }: BillingTabProps) => (
  <Link
    to={to}
    aria-current={active ? "page" : undefined}
    className={cn(
      "pb-2 text-sm whitespace-nowrap transition-colors focus:outline-none border-b-2 -mb-px",
      active
        ? "text-foreground font-medium border-primary"
        : "text-muted-foreground hover:text-foreground border-transparent",
    )}
  >
    {label}
  </Link>
);

export const BillingTabs = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <div className="overflow-x-auto mb-4">
      <div className="flex items-end gap-5 border-b min-w-max">
        <BillingTab
          label={t("billing.balances.title")}
          to={BILLING_LINKS.balances()}
          active={pathname === BILLING_LINKS.balances()}
        />
        <BillingTab
          label={t("billing.all_transactions.title")}
          to={BILLING_LINKS.transactions()}
          active={pathname === BILLING_LINKS.transactions()}
        />
      </div>
    </div>
  );
};
