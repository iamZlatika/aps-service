import { bankingApi } from "@/features/banking/api";
import { BankTransactionsFilterBar } from "@/features/banking/components/BankTransactionsFilterBar.tsx";
import { useBankingSocket } from "@/features/banking/hooks/useBankingSocket.ts";
import { buildBankTransactionColumns } from "@/features/banking/pages/columns.tsx";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { SmartTable } from "@/widgets/table";

const BankingPage = () => {
  useBankingSocket();

  return (
    <SmartTable
      titleKey="banking.transactions.title"
      api={bankingApi.transactions}
      queryKeyFn={queryKeys.banking.transactions}
      searchField="search"
      searchPlaceholder="banking.transactions.search_placeholder"
      columns={buildBankTransactionColumns()}
      filterBar={<BankTransactionsFilterBar />}
      extraFilterKeys={["occurred_at[0]", "occurred_at[1]"]}
    />
  );
};

export default BankingPage;
