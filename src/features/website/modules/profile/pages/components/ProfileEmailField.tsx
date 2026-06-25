import { Check, Mail } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { type Customer } from "@/features/auth/website/types";
import { ChangeEmailModal } from "@/features/website/modules/profile/pages/components/ChangeEmailModal";

interface ProfileEmailFieldProps {
  customer: Customer;
}

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[.14em] text-ws-ink-mute";

const fieldClass =
  "w-full truncate rounded-ws-md border border-ws-line bg-ws-input-bg py-[13px] pl-[42px] pr-[40px] font-[inherit] text-ws-md font-medium text-ws-ink";

export const ProfileEmailField = ({ customer }: ProfileEmailFieldProps) => {
  const { t } = useTranslation("website");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isEmailVerified = !!customer.emailVerifiedAt;

  return (
    <div className="mb-4">
      <div className="mb-[9px] flex items-center justify-between">
        <label className={labelClass}>{t("cabinet.email")}</label>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="text-[12px] font-semibold text-ws-ember-bright hover:underline"
        >
          {t("cabinet.changeEmail")}
        </button>
      </div>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-[14px] text-ws-ink-mute">
          <Mail className="size-4" aria-hidden="true" />
        </span>
        <div className={fieldClass}>{customer.email}</div>
        {isEmailVerified && (
          <span
            className="absolute right-[14px] inline-flex text-ws-green-bright"
            title={t("cabinet.accountConfirmed")}
            aria-hidden="true"
          >
            <Check strokeWidth={2.4} className="size-4" />
          </span>
        )}
      </div>
      {customer.pendingEmail && (
        <p className="mt-[7px] text-[12px] text-ws-ink-soft">
          {t("cabinet.pendingEmailNotice", { email: customer.pendingEmail })}
        </p>
      )}

      <ChangeEmailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
