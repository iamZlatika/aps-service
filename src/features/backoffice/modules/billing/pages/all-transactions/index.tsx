import { billingApi } from "@/features/backoffice/modules/billing/api";
import { AllTransactionsFilterBar } from "@/features/backoffice/modules/billing/components/AllTransactionsFilterBar.tsx";
import { BillingTabs } from "@/features/backoffice/modules/billing/components/BillingTabs.tsx";
import { SystemBalanceCard } from "@/features/backoffice/modules/billing/components/SystemBalanceCard.tsx";
import { buildTransactionColumns } from "@/features/backoffice/modules/billing/pages/columns.tsx";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const AllTransactionsPage = () => {
  return (
    <>
      <div className="p-2 sm:p-4 pb-0 max-w-3xl lg:max-w-7xl mx-auto w-full">
        <BillingTabs />
        <SystemBalanceCard />
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
          "status",
          "type",
          "order_id",
          "created_at[0]",
          "created_at[1]",
        ]}
      />
    </>
  );
};

export default AllTransactionsPage;
