import { type Customer } from "@/features/auth/website/types";
import { AddPhoneGate } from "@/features/website/modules/account/pages/components/AddPhoneGate";
import { VerifyGate } from "@/features/website/modules/account/pages/components/VerifyGate";
import { OrdersList } from "@/features/website/modules/orders/components/OrdersList";

import { lockedOrders } from "./OrdersPanelData";

interface OrdersPanelProps {
  customer: Customer;
}

export const OrdersPanel = ({ customer }: OrdersPanelProps) => {
  const primaryPhone =
    customer.phones.find((p) => p.isPrimary) ?? customer.phones[0];

  const isPhoneVerified = !!primaryPhone?.phoneVerifiedAt;

  if (isPhoneVerified) {
    return <OrdersList />;
  }

  return (
    <div>
      {!primaryPhone ? (
        <AddPhoneGate />
      ) : (
        <VerifyGate phoneNumber={primaryPhone.phoneNumber} />
      )}

      <div
        className="pointer-events-none mt-[26px] flex select-none flex-col gap-3 opacity-50 blur-[4px]"
        aria-hidden="true"
      >
        {lockedOrders.map((order) => (
          <div
            key={order.id}
            className="flex items-center gap-[18px] rounded-[16px] border border-ws-line bg-[rgba(255,255,255,.015)] px-[22px] py-5"
          >
            <span className="text-ws-sm font-bold tabular-nums tracking-[-0.005em] text-ws-ink">
              {order.id}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="mb-1 text-ws-md font-semibold text-ws-ink">
                {order.device}
              </h4>
              <p className="text-ws-xs text-ws-ink-soft">{order.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
