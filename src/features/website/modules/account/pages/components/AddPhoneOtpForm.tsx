import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";

import {
  createVerifyPhoneCodeSchema,
  type VerifyPhoneCodeFormValues,
} from "@/features/website/modules/account/account.schema";
import { useVerifyPhoneCode } from "@/features/website/modules/account/hooks/useVerifyPhoneCode";

interface AddPhoneOtpFormProps {
  phone: string;
  countdown: number;
  resend: (options?: { onSuccess?: () => void }) => void;
  isSending: boolean;
  onVerifySuccess: () => void;
}

export const AddPhoneOtpForm = ({
  phone,
  countdown,
  resend,
  isSending,
  onVerifySuccess,
}: AddPhoneOtpFormProps) => {
  const { t } = useTranslation("website");

  const {
    handleSubmit,
    setError,
    clearErrors,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VerifyPhoneCodeFormValues>({
    resolver: zodResolver(createVerifyPhoneCodeSchema()),
    defaultValues: { code: "" },
  });

  const { submit: verifyCode, isPending: isVerifying } =
    useVerifyPhoneCode(setError);

  const handleCodeChange = (value: string) => {
    setValue("code", value);
    if (errors.root) clearErrors("root");
  };

  const onSubmit = (values: VerifyPhoneCodeFormValues) => {
    verifyCode(values, { onSuccess: onVerifySuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-[18px]">
      <p className="mb-[12px] text-[13.5px] leading-[1.5] text-ws-ink-soft">
        {t("cabinet.addPhoneOtpLabel")}{" "}
        <strong className="font-semibold tabular-nums text-ws-ink">
          {phone}
        </strong>
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-[140px] shrink-0">
          <label htmlFor="apg-code" className="sr-only">
            {t("cabinet.smsCodeLabel")}
          </label>
          <IMaskInput
            id="apg-code"
            mask="0000"
            value={watch("code")}
            onAccept={handleCodeChange}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            placeholder="••••"
            disabled={isVerifying}
            className="w-full rounded-ws-md border border-ws-line bg-ws-input-bg px-[16px] py-[13px] text-center font-[inherit] text-ws-md font-semibold tracking-[0.4em] text-ws-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-55"
          />
        </div>
        <button
          type="submit"
          disabled={isVerifying}
          className="ws-btn ws-btn-primary py-[13px] disabled:opacity-55"
        >
          {isVerifying ? t("cabinet.saving") : t("cabinet.confirmCode")}
        </button>
      </div>
      <p className="mt-[7px] min-h-[17px] text-[12px] text-ws-red-bright">
        {errors.code?.message ?? errors.root?.message}
      </p>
      <div className="mt-[10px] flex items-center gap-[10px] text-[13px] text-ws-ink-mute">
        <span>{t("cabinet.noSmsCode")}</span>
        {countdown > 0 ? (
          <span className="font-semibold tabular-nums text-ws-ink-soft">
            {t("cabinet.resendCodeIn", { seconds: countdown })}
          </span>
        ) : (
          <button
            type="button"
            onClick={() =>
              resend({
                onSuccess: () =>
                  toast.success(t("cabinet.smsCodeSent", { phone })),
              })
            }
            disabled={isSending}
            className="font-semibold text-ws-ember-bright hover:underline disabled:opacity-55"
          >
            {t("cabinet.resendCodeNow")}
          </button>
        )}
      </div>
    </form>
  );
};
