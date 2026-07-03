import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import { usePendingWithdrawalsCount } from "@/features/backoffice/modules/billing/hooks/usePendingWithdrawalsCount.ts";
import { BILLING_LINKS } from "@/features/backoffice/modules/billing/navigation.ts";
import { statusColorMap, statusTextColorMap } from "@/shared/lib/constants.ts";
import { cn } from "@/shared/lib/utils.ts";

interface BillingTabProps {
  label: string;
  to: string;
  active: boolean;
  disabled?: boolean;
  badgeCount?: number;
}

const BillingTab = ({
  label,
  to,
  active,
  disabled,
  badgeCount,
}: BillingTabProps) => {
  const { t } = useTranslation();

  const content = (
    <>
      {label}
      {!!badgeCount && (
        <span
          aria-label={t("billing.withdrawal_requests_count", {
            count: badgeCount,
          })}
          className={cn(
            "ml-1.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold",
            statusColorMap.yellow,
            statusTextColorMap.yellow,
          )}
        >
          {badgeCount}
        </span>
      )}
    </>
  );

  const className = cn(
    "pb-2 text-sm whitespace-nowrap transition-colors focus:outline-none border-b-2 -mb-px",
    disabled
      ? "text-muted-foreground/50 border-transparent cursor-not-allowed"
      : active
        ? "text-foreground font-medium border-primary"
        : "text-muted-foreground hover:text-foreground border-transparent",
  );

  if (disabled) {
    return (
      <span aria-disabled="true" tabIndex={-1} className={className}>
        {content}
      </span>
    );
  }

  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={className}
    >
      {content}
    </Link>
  );
};

export const BillingTabs = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { count: pendingWithdrawalsCount } = usePendingWithdrawalsCount();

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
        <BillingTab
          label={t("billing.withdrawal_requests.title")}
          to={BILLING_LINKS.withdrawalRequests()}
          active={pathname === BILLING_LINKS.withdrawalRequests()}
          disabled={pendingWithdrawalsCount === 0}
          badgeCount={pendingWithdrawalsCount}
        />
      </div>
    </div>
  );
};
