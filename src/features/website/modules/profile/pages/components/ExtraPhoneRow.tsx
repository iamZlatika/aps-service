import { Phone, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { type CustomerPhone } from "@/features/auth/website/types";

interface ExtraPhoneRowProps {
  phone: CustomerPhone;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export const ExtraPhoneRow = ({
  phone,
  onDelete,
  isDeleting,
}: ExtraPhoneRowProps) => {
  const { t } = useTranslation("website");

  return (
    <div className="relative flex items-center">
      <Phone
        className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute"
        aria-hidden="true"
      />
      <input
        type="tel"
        value={phone.phoneNumber}
        readOnly
        className="w-full rounded-ws-md border border-ws-line bg-ws-input-bg py-[13px] pl-[42px] pr-[46px] font-[inherit] text-ws-md font-medium text-ws-ink"
      />
      <button
        type="button"
        onClick={() => onDelete(phone.id)}
        disabled={isDeleting}
        aria-label={t("cabinet.deletePhone")}
        className="absolute right-[8px] inline-flex size-[32px] items-center justify-center rounded-[8px] text-ws-ink-mute transition-colors duration-150 hover:text-ws-red-bright disabled:opacity-55"
      >
        <Trash2 className="size-[15px]" aria-hidden="true" />
      </button>
    </div>
  );
};
