import { useState } from "react";

import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { billingApi } from "@/features/backoffice/modules/billing/api";
import { AdjustSystemBalanceModal } from "@/features/backoffice/modules/billing/components/AdjustSystemBalanceModal.tsx";
import { BillingTabs } from "@/features/backoffice/modules/billing/components/BillingTabs.tsx";
import { SystemBalanceCard } from "@/features/backoffice/modules/billing/components/SystemBalanceCard.tsx";
import { WithdrawalDecisionButtons } from "@/features/backoffice/modules/billing/components/WithdrawalDecisionButtons.tsx";
import { buildTransactionColumns } from "@/features/backoffice/modules/billing/pages/columns.tsx";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const WithdrawalRequestsPage = () => {
  const { can } = useAuth();
  const canDecideWithdrawals = can("billing_balance_adjust");
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
