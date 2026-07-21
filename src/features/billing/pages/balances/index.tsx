import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ABILITIES } from "@/features/auth/abilities.ts";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { billingApi } from "@/features/billing/api";
import { AdjustBalanceModal } from "@/features/billing/components/AdjustBalanceModal.tsx";
import { AdjustSystemBalanceModal } from "@/features/billing/components/AdjustSystemBalanceModal.tsx";
import { BillingTabs } from "@/features/billing/components/BillingTabs.tsx";
import { SystemBalanceCard } from "@/features/billing/components/SystemBalanceCard.tsx";
import { BILLING_LINKS } from "@/features/billing/navigation.ts";
import { buildBalanceColumns } from "@/features/billing/pages/columns.tsx";
import { type Balance } from "@/features/billing/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { SmartTable } from "@/widgets/table";

const BalancesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { can } = useAuth();
  const canAdjust = can(ABILITIES.BILLING_BALANCE_ADJUST);
  const [adjustingBalance, setAdjustingBalance] = useState<Balance | null>(
    null,
  );
  const [isAdjustingSystemBalance, setIsAdjustingSystemBalance] =
    useState(false);

  return (
    <>
      <div className="p-2 sm:p-4 pb-0 max-w-3xl lg:max-w-7xl mx-auto w-full">
        <BillingTabs />
        <SystemBalanceCard onAdjust={() => setIsAdjustingSystemBalance(true)} />
      </div>
      <SmartTable
        titleKey="billing.balances.title"
        api={billingApi.balances}
        queryKeyFn={queryKeys.billing.balances}
        searchField="user_name"
        searchPlaceholder="billing.balances.search_placeholder"
        columns={buildBalanceColumns()}
        onRowClick={(balance) =>
          navigate(BILLING_LINKS.transactionsByUser(balance.user.id))
        }
        renderRowActions={
          canAdjust
            ? (balance) => (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAdjustingBalance(balance);
                  }}
                >
                  {t("billing.balances.adjust")}
                </Button>
              )
            : undefined
        }
        extraFilterKeys={["user_id"]}
      />
      {adjustingBalance && (
        <AdjustBalanceModal
          open
          onClose={() => setAdjustingBalance(null)}
          userId={adjustingBalance.user.id}
          userName={adjustingBalance.user.name}
        />
      )}
      {isAdjustingSystemBalance && (
        <AdjustSystemBalanceModal
          open
          onClose={() => setIsAdjustingSystemBalance(false)}
        />
      )}
    </>
  );
};

export default BalancesPage;
