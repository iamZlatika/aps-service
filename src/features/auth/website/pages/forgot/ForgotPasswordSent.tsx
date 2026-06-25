import { Info, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ForgotPasswordSentProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordSent = ({
  onBackToLogin,
}: ForgotPasswordSentProps) => {
  const { t } = useTranslation("website");

  return (
    <div className="text-center">
      <div
        aria-hidden="true"
        className="relative mx-auto mb-[22px] mt-1 flex size-16 items-center justify-center rounded-[18px] border border-[color-mix(in_oklab,var(--ws-ember)_28%,transparent)] bg-[color-mix(in_oklab,var(--ws-ember)_14%,transparent)] text-ws-ember-bright"
      >
        <Mail className="size-[30px]" />
        <span
          aria-hidden="true"
          className="absolute -right-[5px] -top-[5px] size-[14px] rounded-full bg-ws-ember shadow-[0_0_0_4px_var(--ws-bg-2),0_0_12px_var(--ws-ember)]"
        />
      </div>

      <h2 className="text-[26px] font-light leading-[1.15] tracking-[-0.018em] text-ws-ink">
        {t("forgotPassword.sent.title")}
      </h2>

      <p className="mt-3 text-pretty text-[13.5px] leading-[1.5] text-ws-ink-soft">
        {t("forgotPassword.sent.subtitle")}
      </p>

      <div className="mt-[20px] flex items-start gap-[11px] rounded-ws-md border border-dashed border-ws-line p-[13px_16px] text-left text-[12.5px] leading-[1.5] text-ws-ink-mute">
        <Info className="mt-[1px] size-4 shrink-0 text-ws-ember-bright" />
        <span>{t("forgotPassword.sent.hint")}</span>
      </div>

      <button
        type="button"
        className="mt-[22px] text-[13.5px] font-semibold text-ws-ember-bright hover:underline"
        onClick={onBackToLogin}
      >
        {t("forgotPassword.sent.backToLogin")}
      </button>
    </div>
  );
};
