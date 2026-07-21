import { useState } from "react";

import { ABILITIES } from "@/features/auth/abilities.ts";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { billingApi } from "@/features/billing/api";
import { AdjustSystemBalanceModal } from "@/features/billing/components/AdjustSystemBalanceModal.tsx";
import { BillingTabs } from "@/features/billing/components/BillingTabs.tsx";
import { SystemBalanceCard } from "@/features/billing/components/SystemBalanceCard.tsx";
import { WithdrawalDecisionButtons } from "@/features/billing/components/WithdrawalDecisionButtons.tsx";
import { buildTransactionColumns } from "@/features/billing/pages/columns.tsx";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { SmartTable } from "@/widgets/table";

const WithdrawalRequestsPage = () => {
  const { can } = useAuth();
  const canDecideWithdrawals = can(ABILITIES.BILLING_BALANCE_ADJUST);
  const [isAdjustingSystemBalance, setIsAdjustingSystemBalance] =
    useState(false);

  return (
    <>
      <div className="p-2 sm:p-4 pb-0 max-w-3xl lg:max-w-7xl mx-auto w-full">
        <BillingTabs />
        <SystemBalanceCard onAdjust={() => setIsAdjustingSystemBalance(true)} />
      </div>
      <SmartTable
        className="max-w-[2560px] lg:max-w-[2560px]"
        titleKey="billing.withdrawal_requests.title"
        api={billingApi.withdrawalRequests}
        queryKeyFn={queryKeys.billing.withdrawalRequests}
        searchPlaceholder="billing.withdrawal_requests.title"
        columns={buildTransactionColumns({ showEmployeeColumn: true })}
        renderRowActions={
          canDecideWithdrawals
            ? (transaction) => (
                <WithdrawalDecisionButtons transactionId={transaction.id} />
              )
            : undefined
        }
      />
      {isAdjustingSystemBalance && (
        <AdjustSystemBalanceModal
          open
          onClose={() => setIsAdjustingSystemBalance(false)}
        />
      )}
    </>
  );
};

export default WithdrawalRequestsPage;
