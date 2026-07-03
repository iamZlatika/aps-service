import { smsIntegrationApi } from "@/features/backoffice/modules/sms-integration/api";
import { SmsBalanceCard } from "@/features/backoffice/modules/sms-integration/components/SmsBalanceCard.tsx";
import { SmsMessagesFilterBar } from "@/features/backoffice/modules/sms-integration/components/SmsMessagesFilterBar.tsx";
import { buildSmsMessageColumns } from "@/features/backoffice/modules/sms-integration/pages/columns.tsx";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const SmsIntegrationPage = () => (
  <>
    <div className="p-2 sm:p-4 pb-0 max-w-3xl lg:max-w-7xl mx-auto w-full">
      <SmsBalanceCard />
    </div>
    <SmartTable
      titleKey="smsIntegration.messages.title"
      api={smsIntegrationApi.messages}
      queryKeyFn={queryKeys.smsIntegration.messages}
      searchField="phone"
      searchPlaceholder="smsIntegration.messages.search_placeholder"
      columns={buildSmsMessageColumns()}
      filterBar={<SmsMessagesFilterBar />}
      extraFilterKeys={["status"]}
    />
  </>
);

export default SmsIntegrationPage;
