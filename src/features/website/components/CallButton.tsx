import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CallButtonProps {
  phone: string;
}

export const CallButton = ({ phone }: CallButtonProps) => {
  const { t } = useTranslation("website");

  return (
    <a
      href={`tel:${phone}`}
      className="inline-flex items-center gap-[9px] rounded-[11px] bg-gradient-to-b from-ws-ember-bright to-ws-ember px-[22px] py-[13px] text-sm font-semibold text-[var(--ws-ember-text)] shadow-[0_12px_30px_-12px_rgba(238,122,58,.55),inset_0_1px_0_rgba(255,255,255,.3)] transition-transform hover:-translate-y-px max-sm:order-first max-sm:w-full max-sm:justify-center"
    >
      <Phone aria-hidden="true" className="size-[15px]" />
      <span>{t("priceModal.callButton")}</span>
    </a>
  );
};
