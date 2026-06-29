import { Check, ChevronLeft, Info, Lock, Phone, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { type Customer } from "@/features/auth/website/types";
import { CUSTOMER_ACCOUNT_LINKS } from "@/features/website/modules/account/navigation";
import { ChangePasswordModal } from "@/features/website/modules/profile/pages/components/ChangePasswordModal";
import { ChangePhoneModal } from "@/features/website/modules/profile/pages/components/ChangePhoneModal";
import { ExtraPhonesSection } from "@/features/website/modules/profile/pages/components/ExtraPhonesSection";
import { ProfileAvatar } from "@/features/website/modules/profile/pages/components/ProfileAvatar";
import { ProfileEmailField } from "@/features/website/modules/profile/pages/components/ProfileEmailField";
import { ProfileNameField } from "@/features/website/modules/profile/pages/components/ProfileNameField";
import { TelegramRow } from "@/features/website/modules/profile/pages/components/TelegramRow";

interface ProfilePanelProps {
  customer: Customer;
}

const inputClass =
  "w-full rounded-ws-md border border-ws-line bg-ws-input-bg py-[13px] pl-[42px] pr-[40px] font-[inherit] text-ws-md font-medium text-ws-ink disabled:cursor-not-allowed disabled:opacity-55";

export const ProfilePanel = ({ customer }: ProfilePanelProps) => {
  const { t } = useTranslation("website");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneModalKey, setPhoneModalKey] = useState(0);

  const primaryPhone = customer.phones.find((p) => p.isPrimary);
  const extraPhones = customer.phones.filter((p) => !p.isPrimary);

  const isPhoneVerified = !!primaryPhone?.phoneVerifiedAt;
  const displayName = customer.portalName ?? "Client";

  return (
    <div className="max-w-[800px]">
      <Link
        to={CUSTOMER_ACCOUNT_LINKS.root()}
        className="mb-[18px] inline-flex items-center gap-2 border-0 bg-transparent p-0 font-[inherit] text-ws-base font-semibold text-ws-ink-soft no-underline transition-colors duration-150 hover:text-ws-ember-bright"
      >
        <ChevronLeft className="size-[15px]" aria-hidden="true" />
        {t("cabinet.backToOrders")}
      </Link>

      <div className="rounded-ws-card border border-ws-line bg-ws-card p-[26px]">
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
            <div className="mb-[9px] flex items-center gap-[8px]">
              <label
                htmlFor="pf-phone"
                className="block text-[11px] font-semibold uppercase tracking-[.14em] text-ws-ink-mute"
              >
                {t("cabinet.phone")}
              </label>
              {isPhoneVerified ? (
                <span className="inline-flex items-center gap-[4px] rounded-full border border-[rgba(93,184,111,.3)] bg-[rgba(93,184,111,.14)] px-[8px] py-[3px] text-[10px] font-semibold leading-none text-ws-green-bright">
                  <Check
                    className="size-[10px]"
                    strokeWidth={2.6}
                    aria-hidden="true"
                  />
                  {t("cabinet.phoneBadgeVerified")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-[4px] rounded-full border border-[rgba(216,85,62,.22)] bg-[rgba(216,85,62,.1)] px-[8px] py-[3px] text-[10px] font-semibold leading-none text-ws-red">
                  <X className="size-[10px]" aria-hidden="true" />
                  {t("cabinet.phoneBadgeNotVerified")}
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setPhoneModalKey((k) => k + 1);
                  setIsPhoneModalOpen(true);
                }}
                className="ml-auto text-[12px] font-semibold text-ws-ember-bright hover:underline"
              >
                {t("cabinet.changePhone")}
              </button>
            </div>
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
            </div>
            <div className="mt-[10px] flex items-start gap-[9px] text-[12px] leading-[1.5] text-ws-ink-mute">
              <Info
                className="mt-[1px] size-[14px] shrink-0 text-ws-ember-bright"
                aria-hidden="true"
              />
              <span>{t("cabinet.primaryPhoneHint")}</span>
            </div>
          </div>
        )}

        <div className="my-[22px] h-px bg-ws-line-soft" />

        <ExtraPhonesSection phones={extraPhones} />

        <div className="my-[22px] h-px bg-ws-line-soft" />

        <h3 className="mb-[14px] text-[11px] font-semibold uppercase tracking-[.16em] text-ws-ink-mute">
          {t("cabinet.telegramNotificationsTitle")}
        </h3>
        <TelegramRow telegram={customer.telegram} />

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
      <ChangePhoneModal
        key={phoneModalKey}
        open={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />
    </div>
  );
};
