import { Info, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/shared/lib/utils";

import { useCountdown } from "./useCountdown";
import { useResendEmail } from "./useResendEmail";

const RESEND_COOLDOWN_SECONDS = 60;

interface RegistrationEmailSentProps {
  email: string;
  onBackToLogin: () => void;
}

export const RegistrationEmailSent = ({
  email,
  onBackToLogin,
}: RegistrationEmailSentProps) => {
  const { t } = useTranslation("website");
  const { seconds, isRunning, reset } = useCountdown(RESEND_COOLDOWN_SECONDS);
  const { resend, isPending } = useResendEmail();

  const resendLabel = isRunning
    ? t("registration.emailSent.resendWait", { seconds })
    : t("registration.emailSent.resend");

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
        {t("registration.emailSent.title")}
      </h2>

      <p className="mt-3 text-pretty text-[13.5px] leading-[1.5] text-ws-ink-soft">
        {t("registration.emailSent.subtitle")}
      </p>

      <p className="mt-[10px] break-all text-[15px] font-semibold text-ws-ink">
        {email}
      </p>

      <p className="mt-3 text-pretty text-[13.5px] leading-[1.5] text-ws-ink-soft">
        {t("registration.emailSent.action")}
      </p>

      <div className="mt-[20px] flex items-start gap-[11px] rounded-ws-md border border-dashed border-ws-line p-[13px_16px] text-left text-[12.5px] leading-[1.5] text-ws-ink-mute">
        <Info className="mt-[1px] size-4 shrink-0 text-ws-ember-bright" />
        <span>{t("registration.emailSent.spamHint")}</span>
      </div>

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {resendLabel}
      </span>

      <button
        type="button"
        disabled={isRunning || isPending}
        onClick={() => resend(email, reset)}
        className={cn(
          "ws-btn mt-5 w-full justify-center",
          "disabled:border disabled:border-ws-line disabled:[background:none] disabled:cursor-default disabled:shadow-none disabled:tabular-nums disabled:text-ws-ink-mute",
          !isRunning && "ws-btn-primary",
        )}
      >
        {resendLabel}
      </button>

      <button
        type="button"
        className="mt-[22px] text-[13.5px] font-semibold text-ws-ember-bright hover:underline"
        onClick={onBackToLogin}
      >
        {t("registration.emailSent.backToLogin")}
      </button>
    </div>
  );
};
