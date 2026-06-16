import { Check, ChevronLeft, Lock, Mail, Phone, User } from "lucide-react";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { type Customer } from "@/features/auth/website/types";

interface ProfilePanelProps {
  customer: Customer;
  onBack: () => void;
}

const labelClass =
  "mb-[9px] block text-[11px] font-semibold uppercase tracking-[.14em] text-ws-ink-mute";

const inputClass =
  "w-full rounded-ws-md border border-ws-line bg-[rgba(255,255,255,.025)] py-[13px] pl-[42px] pr-[40px] font-[inherit] text-ws-md font-medium text-ws-ink disabled:cursor-not-allowed disabled:opacity-55";

interface FieldProps {
  readonly id: string;
  readonly label: string;
  readonly type: string;
  readonly value: string;
  readonly verified?: boolean;
  readonly verifiedLabel?: string;
  readonly icon: ReactNode;
}

const ProfileField = ({
  id,
  label,
  type,
  value,
  verified,
  verifiedLabel,
  icon,
}: FieldProps) => (
  <div className="mb-4">
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <div className="relative flex items-center">
      <span className="pointer-events-none absolute left-[14px] text-ws-ink-mute">
        {icon}
      </span>
      <input
        id={id}
        type={type}
        defaultValue={value}
        disabled
        className={inputClass}
      />
      {verified && (
        <span
          className="absolute right-[14px] inline-flex text-ws-green-bright"
          title={verifiedLabel}
          aria-hidden="true"
        >
          <Check strokeWidth={2.4} className="size-4" />
        </span>
      )}
    </div>
  </div>
);

export const ProfilePanel = ({ customer, onBack }: ProfilePanelProps) => {
  const { t } = useTranslation("website");

  const primaryPhone =
    customer.phones.find((p) => p.isPrimary) ?? customer.phones[0];

  const isEmailVerified = !!customer.emailVerifiedAt;
  const isPhoneVerified = !!primaryPhone?.phoneVerifiedAt;
  const avatarInitial = customer.name.charAt(0).toUpperCase();

  return (
    <div className="max-w-[800px]">
      <button
        type="button"
        onClick={onBack}
        className="mb-[18px] inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-[inherit] text-ws-base font-semibold text-ws-ink-soft transition-colors duration-150 hover:text-ws-ember-bright"
      >
        <ChevronLeft className="size-[15px]" aria-hidden="true" />
        {t("cabinet.backToOrders")}
      </button>

      <div className="rounded-ws-card border border-ws-line bg-[rgba(255,255,255,.015)] p-[26px]">
        <div className="mb-[22px] flex flex-wrap items-center justify-between gap-4 border-b border-ws-line-soft pb-[22px]">
          <div className="flex items-center gap-4">
            <div className="relative flex size-16 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-ws-ember to-ws-ember-deep text-[26px] font-semibold text-white">
              {customer.avatarUrl ? (
                <img
                  src={customer.avatarUrl}
                  alt={customer.name}
                  className="size-full object-cover"
                />
              ) : (
                avatarInitial
              )}
            </div>
            <div>
              <p className="text-ws-lg font-semibold tracking-[-0.01em] text-ws-ink">
                {customer.name}
              </p>
              {customer.email && (
                <p className="mt-[3px] text-ws-sm text-ws-ink-soft">
                  {customer.email}
                </p>
              )}
            </div>
          </div>

          {isEmailVerified && (
            <span className="inline-flex items-center gap-[7px] rounded-full border border-ws-green/30 bg-ws-green/12 px-[13px] py-[6px] text-ws-2xs font-semibold text-ws-green-soft">
              <Check
                strokeWidth={2.4}
                className="size-[13px]"
                aria-hidden="true"
              />
              {t("cabinet.accountConfirmed")}
            </span>
          )}
        </div>

        <h3 className="mb-[18px] text-[11px] font-semibold uppercase tracking-[.16em] text-ws-ink-mute">
          {t("cabinet.personalData")}
        </h3>

        <ProfileField
          id="pf-name"
          label={t("cabinet.name")}
          type="text"
          value={customer.name}
          icon={<User className="size-4" />}
        />

        <ProfileField
          id="pf-email"
          label={t("cabinet.email")}
          type="email"
          value={customer.email ?? ""}
          verified={isEmailVerified}
          verifiedLabel={t("cabinet.accountConfirmed")}
          icon={<Mail className="size-4" />}
        />

        {primaryPhone && (
          <ProfileField
            id="pf-phone"
            label={t("cabinet.phone")}
            type="tel"
            value={primaryPhone.phoneNumber}
            verified={isPhoneVerified}
            verifiedLabel={t("cabinet.accountConfirmed")}
            icon={<Phone className="size-4" />}
          />
        )}

        <div className="mt-2 flex flex-wrap gap-[10px]">
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-ws-md border-0 bg-gradient-to-b from-ws-ember-bright to-ws-ember px-[22px] py-[13px] font-[inherit] text-[14.5px] font-semibold text-ws-ember-text opacity-55 shadow-[0_12px_30px_-12px_rgba(238,122,58,.5),inset_0_1px_0_rgba(255,255,255,.3)]"
          >
            {t("cabinet.saveChanges")}
          </button>
        </div>

        <div className="my-[22px] h-px bg-ws-line-soft" />

        <h3 className="mb-[18px] text-[11px] font-semibold uppercase tracking-[.16em] text-ws-ink-mute">
          {t("cabinet.security")}
        </h3>
        <button
          type="button"
          disabled
          className="inline-flex cursor-not-allowed items-center gap-[9px] rounded-ws-md border border-ws-line bg-transparent px-[22px] py-[13px] font-[inherit] text-[14.5px] font-semibold text-ws-ink opacity-55 transition-all duration-150"
        >
          <Lock className="size-[15px]" aria-hidden="true" />
          {t("cabinet.changePassword")}
        </button>
      </div>
    </div>
  );
};
