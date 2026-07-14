import { useState } from "react";

import { ABILITIES } from "@/features/auth/backoffice/abilities.ts";
import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { billingApi } from "@/features/backoffice/modules/billing/api";
import { AdjustSystemBalanceModal } from "@/features/backoffice/modules/billing/components/AdjustSystemBalanceModal.tsx";
import { AllTransactionsFilterBar } from "@/features/backoffice/modules/billing/components/AllTransactionsFilterBar.tsx";
import { BillingTabs } from "@/features/backoffice/modules/billing/components/BillingTabs.tsx";
import { SystemBalanceCard } from "@/features/backoffice/modules/billing/components/SystemBalanceCard.tsx";
import { WithdrawalDecisionButtons } from "@/features/backoffice/modules/billing/components/WithdrawalDecisionButtons.tsx";
import { buildTransactionColumns } from "@/features/backoffice/modules/billing/pages/columns.tsx";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { TRANSACTION_STATUSES, TRANSACTION_TYPES } from "@/shared/types.ts";

const AllTransactionsPage = () => {
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
        titleKey="billing.all_transactions.title"
        api={billingApi.allTransactions}
        queryKeyFn={queryKeys.billing.allTransactions}
        searchPlaceholder="billing.all_transactions.title"
        columns={buildTransactionColumns({ showEmployeeColumn: true })}
        filterBar={<AllTransactionsFilterBar />}
        extraFilterKeys={[
          "user_id",
          "only_system",
          "status",
          "type",
          "order_number",
          "created_at[0]",
          "created_at[1]",
        ]}
        renderRowActions={
          canDecideWithdrawals
            ? (transaction) =>
                transaction.type === TRANSACTION_TYPES.WITHDRAWAL_REQUEST &&
                transaction.status === TRANSACTION_STATUSES.PENDING ? (
                  <WithdrawalDecisionButtons transactionId={transaction.id} />
                ) : undefined
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

export default AllTransactionsPage;
