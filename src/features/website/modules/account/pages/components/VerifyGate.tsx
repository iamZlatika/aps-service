import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Smartphone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import {
  createVerifyPhoneCodeSchema,
  type VerifyPhoneCodeFormValues,
} from "@/features/website/modules/account/account.schema";
import { useSendPhoneCode } from "@/features/website/modules/account/hooks/useSendPhoneCode";
import { useVerifyPhoneCode } from "@/features/website/modules/account/hooks/useVerifyPhoneCode";
import { CUSTOMER_PROFILE_LINKS } from "@/features/website/modules/profile/navigation";

interface VerifyGateProps {
  readonly phoneNumber: string;
}

export const VerifyGate = ({ phoneNumber }: VerifyGateProps) => {
  const { t } = useTranslation("website");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const { submit: sendCode, isPending: isSending } = useSendPhoneCode();

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

  const handleSendCode = () => {
    sendCode(phoneNumber, {
      onSuccess: () => {
        toast.success(t("cabinet.smsCodeSent", { phone: phoneNumber }));
        setIsCodeSent(true);
        setValue("code", "");
        clearErrors();
      },
    });
  };

  const handleCodeChange = (value: string) => {
    setValue("code", value);
    if (errors.root) clearErrors("root");
  };

  const onSubmit = (values: VerifyPhoneCodeFormValues) => {
    verifyCode(values, {
      onSuccess: () => toast.success(t("cabinet.phoneVerified")),
    });
  };

  return (
    <div className="max-w-[620px] rounded-ws-card border border-[rgba(238,122,58,.26)] bg-[rgba(238,122,58,.07)] px-[32px] py-[30px] max-[560px]:px-[20px] max-[560px]:py-[24px]">
      <div className="mb-[18px] flex size-[50px] items-center justify-center rounded-[14px] border border-[rgba(238,122,58,.3)] bg-[rgba(238,122,58,.16)] text-ws-ember-bright">
        <Smartphone className="size-6" aria-hidden="true" />
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
      <p className="mt-[10px] max-w-[480px] text-[13px] leading-[1.6] text-ws-ink-mute text-pretty">
        {t("cabinet.verifyGateWrongPhoneHint")}{" "}
        <Link
          to={CUSTOMER_PROFILE_LINKS.root()}
          className="font-semibold text-ws-ember-bright hover:underline"
        >
          {t("cabinet.verifyGateWrongPhoneHintLink")}
        </Link>
        .
      </p>

      {!isCodeSent ? (
        <button
          type="button"
          onClick={handleSendCode}
          disabled={isSending}
          className="ws-btn ws-btn-primary mt-[22px]"
        >
          <Send className="size-4" aria-hidden="true" />
          {isSending ? t("cabinet.saving") : t("cabinet.getSmsCode")}
        </button>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-[22px]"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-[140px] shrink-0">
              <label htmlFor="vg-code" className="sr-only">
                {t("cabinet.smsCodeLabel")}
              </label>
              <IMaskInput
                id="vg-code"
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

            <button
              type="button"
              onClick={handleSendCode}
              disabled={isSending}
              className="px-2 py-[13px] text-[13px] font-semibold text-ws-ember-bright hover:underline disabled:opacity-55"
            >
              {t("cabinet.resendCode")}
            </button>
          </div>
          <p className="mt-[7px] min-h-[17px] text-[12px] text-ws-red-bright">
            {errors.code?.message ?? errors.root?.message}
          </p>
        </form>
      )}
    </div>
  );
};
