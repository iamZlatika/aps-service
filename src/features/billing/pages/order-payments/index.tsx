import { billingApi } from "@/features/billing/api";
import { BillingTabs } from "@/features/billing/components/BillingTabs.tsx";
import { OrderPaymentsFilterBar } from "@/features/billing/components/OrderPaymentsFilterBar.tsx";
import { OrderPaymentsSummaryCards } from "@/features/billing/components/OrderPaymentsSummaryCards.tsx";
import { ORDER_PAYMENTS_FILTER_KEYS } from "@/features/billing/lib/constants.ts";
import { buildOrderPaymentColumns } from "@/features/billing/pages/columns.tsx";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { SmartTable } from "@/widgets/table";

const OrderPaymentsReportPage = () => (
  <>
    <div className="p-2 sm:p-4 pb-0 max-w-3xl lg:max-w-7xl mx-auto w-full">
      <BillingTabs />
      <OrderPaymentsSummaryCards />
    </div>
    <SmartTable
      className="max-w-[2560px] lg:max-w-[2560px]"
      titleKey="billing.order_payments.title"
      api={billingApi.orderPayments}
      queryKeyFn={queryKeys.billing.orderPayments}
      searchPlaceholder="billing.order_payments.title"
      columns={buildOrderPaymentColumns()}
      filterBar={<OrderPaymentsFilterBar />}
      extraFilterKeys={[...ORDER_PAYMENTS_FILTER_KEYS]}
    />
  </>
);

export default OrderPaymentsReportPage;
