import { Check, ChevronLeft, Lock, Phone } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { type Customer } from "@/features/auth/website/types";
import { CUSTOMER_ACCOUNT_LINKS } from "@/features/website/modules/account/navigation";
import { ChangePasswordModal } from "@/features/website/modules/profile/pages/components/ChangePasswordModal";
import { ProfileAvatar } from "@/features/website/modules/profile/pages/components/ProfileAvatar";
import { ProfileEmailField } from "@/features/website/modules/profile/pages/components/ProfileEmailField";
import { ProfileNameField } from "@/features/website/modules/profile/pages/components/ProfileNameField";

interface ProfilePanelProps {
  customer: Customer;
}

const labelClass =
  "mb-[9px] block text-[11px] font-semibold uppercase tracking-[.14em] text-ws-ink-mute";

const inputClass =
  "w-full rounded-ws-md border border-ws-line bg-[rgba(255,255,255,.025)] py-[13px] pl-[42px] pr-[40px] font-[inherit] text-ws-md font-medium text-ws-ink disabled:cursor-not-allowed disabled:opacity-55";

export const ProfilePanel = ({ customer }: ProfilePanelProps) => {
  const { t } = useTranslation("website");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const primaryPhone =
    customer.phones.find((p) => p.isPrimary) ?? customer.phones[0];

  const isPhoneVerified = !!primaryPhone?.phoneVerifiedAt;
  const displayName = customer.portalName ?? customer.name;

  return (
    <div className="max-w-[800px]">
      <Link
        to={CUSTOMER_ACCOUNT_LINKS.root()}
        className="mb-[18px] inline-flex items-center gap-2 border-0 bg-transparent p-0 font-[inherit] text-ws-base font-semibold text-ws-ink-soft no-underline transition-colors duration-150 hover:text-ws-ember-bright"
      >
        <ChevronLeft className="size-[15px]" aria-hidden="true" />
        {t("cabinet.backToOrders")}
      </Link>

      <div className="rounded-ws-card border border-ws-line bg-[rgba(255,255,255,.015)] p-[26px]">
        <div className="mb-[22px] flex items-center gap-4 border-b border-ws-line-soft pb-[22px]">
          <ProfileAvatar customer={customer} />
          <div>
            <p className="text-ws-lg font-semibold tracking-[-0.01em] text-ws-ink">
              {displayName}
            </p>
            {customer.email && (
              <p className="mt-[3px] text-ws-sm text-ws-ink-soft">
                {customer.email}
              </p>
            )}
          </div>
        </div>

        <h3 className="mb-[18px] text-[11px] font-semibold uppercase tracking-[.16em] text-ws-ink-mute">
          {t("cabinet.personalData")}
        </h3>

        <ProfileNameField customer={customer} />
        <ProfileEmailField customer={customer} />

        {primaryPhone && (
          <div className="mb-4">
            <label htmlFor="pf-phone" className={labelClass}>
              {t("cabinet.phone")}
            </label>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-[14px] text-ws-ink-mute">
                <Phone className="size-4" aria-hidden="true" />
              </span>
              <input
                id="pf-phone"
                type="tel"
                defaultValue={primaryPhone.phoneNumber}
                disabled
                className={inputClass}
              />
              {isPhoneVerified && (
                <span
                  className="absolute right-[14px] inline-flex text-ws-green-bright"
                  title={t("cabinet.accountConfirmed")}
                  aria-hidden="true"
                >
                  <Check strokeWidth={2.4} className="size-4" />
                </span>
              )}
            </div>
          </div>
        )}

        <div className="my-[22px] h-px bg-ws-line-soft" />

        <h3 className="mb-[18px] text-[11px] font-semibold uppercase tracking-[.16em] text-ws-ink-mute">
          {t("cabinet.security")}
        </h3>
        <button
          type="button"
          onClick={() => setIsPasswordModalOpen(true)}
          className="ws-btn ws-btn-ghost"
        >
          <Lock className="size-[15px]" aria-hidden="true" />
          {t("cabinet.changePassword")}
        </button>
      </div>

      <ChangePasswordModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};
