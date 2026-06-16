import { useTranslation } from "react-i18next";

import { type Customer } from "@/features/auth/website/types";

import { lockedOrders } from "./OrdersPanelData";

interface OrdersPanelProps {
  customer: Customer;
}

interface VerifyGateProps {
  readonly phoneNumber: string;
}

const VerifyGate = ({ phoneNumber }: VerifyGateProps) => {
  const { t } = useTranslation("website");

  return (
    <div className="max-w-[620px] rounded-ws-card border border-[rgba(238,122,58,.26)] bg-[rgba(238,122,58,.07)] px-[32px] py-[30px] max-[560px]:px-[20px] max-[560px]:py-[24px]">
      <div className="mb-[18px] flex size-[50px] items-center justify-center rounded-[14px] border border-[rgba(238,122,58,.3)] bg-[rgba(238,122,58,.16)] text-ws-ember-bright">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6"
          aria-hidden="true"
        >
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <path d="M12 18h.01" />
        </svg>
      </div>

      <h2 className="text-[22px] font-medium leading-[1.2] tracking-[-0.01em] text-ws-ink">
        {t("cabinet.verifyGateTitle")}
      </h2>
      <p className="mt-3 max-w-[480px] text-[14.5px] leading-[1.6] text-ws-ink-soft text-pretty">
        {t("cabinet.verifyGateDesc")}
      </p>
      <p className="mt-[14px] text-ws-md font-bold tabular-nums text-ws-ink">
        {phoneNumber}
      </p>

      <button
        type="button"
        disabled
        className="mt-[22px] inline-flex cursor-not-allowed items-center gap-[10px] rounded-ws-md border-0 bg-gradient-to-b from-ws-ember-bright to-ws-ember px-6 py-[14px] font-[inherit] text-[14.5px] font-semibold text-ws-ember-text opacity-55 shadow-[0_14px_34px_-14px_rgba(238,122,58,.55),inset_0_1px_0_rgba(255,255,255,.3)]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
          aria-hidden="true"
        >
          <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
        </svg>
        {t("cabinet.getSmsCode")}
      </button>
    </div>
  );
};

export const OrdersPanel = ({ customer }: OrdersPanelProps) => {
  const primaryPhone =
    customer.phones.find((p) => p.isPrimary) ?? customer.phones[0];

  const isPhoneVerified = !!primaryPhone?.phoneVerifiedAt;

  if (isPhoneVerified) {
    return <div className="mt-6 text-ws-ink-mute text-ws-base">—</div>;
  }

  return (
    <div>
      {primaryPhone && <VerifyGate phoneNumber={primaryPhone.phoneNumber} />}

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
