import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Send, Smartphone } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";

import {
  createVerifyPhoneCodeSchema,
  type VerifyPhoneCodeFormValues,
} from "@/features/website/modules/account/account.schema";
import { useAddPhoneFlow } from "@/features/website/modules/account/hooks/useAddPhoneFlow";
import { useVerifyPhoneCode } from "@/features/website/modules/account/hooks/useVerifyPhoneCode";
import {
  type AddPhoneFormValues,
  createAddPhoneSchema,
} from "@/features/website/modules/account/pages/components/addPhoneGate.schema";
import { cn } from "@/shared/lib/utils";

export const AddPhoneGate = () => {
  const { t } = useTranslation("website");
  const { isCodeSent, phone, submitPhone, resend, isSending } =
    useAddPhoneFlow();

  const {
    handleSubmit: handlePhoneSubmit,
    setValue: setPhoneValue,
    watch: watchPhone,
    formState: { errors: phoneErrors },
  } = useForm<AddPhoneFormValues>({
    resolver: zodResolver(createAddPhoneSchema()),
    defaultValues: { phone: "" },
  });

  const {
    handleSubmit: handleOtpSubmit,
    setError: setOtpError,
    clearErrors: clearOtpErrors,
    watch: watchOtp,
    setValue: setOtpValue,
    formState: { errors: otpErrors },
  } = useForm<VerifyPhoneCodeFormValues>({
    resolver: zodResolver(createVerifyPhoneCodeSchema()),
    defaultValues: { code: "" },
  });

  const { submit: verifyCode, isPending: isVerifying } =
    useVerifyPhoneCode(setOtpError);

  const handlePhoneChange = (masked: string) => {
    const digits = masked.replace(/\D/g, "");
    setPhoneValue("phone", digits ? "+38" + digits : "", {
      shouldValidate: false,
    });
  };

  const onPhoneSubmit = (values: AddPhoneFormValues) => {
    submitPhone(values.phone);
  };

  const handleCodeChange = (value: string) => {
    setOtpValue("code", value);
    if (otpErrors.root) clearOtpErrors("root");
  };

  const onOtpSubmit = (values: VerifyPhoneCodeFormValues) => {
    verifyCode(values, {
      onSuccess: () => toast.success(t("cabinet.phoneVerified")),
    });
  };

  const phoneRaw = watchPhone("phone");

  return (
    <div className="max-w-[620px] rounded-ws-card border border-[rgba(238,122,58,.26)] bg-[rgba(238,122,58,.07)] px-[32px] py-[30px] max-[560px]:px-[20px] max-[560px]:py-[24px]">
      <div className="mb-[18px] flex size-[50px] items-center justify-center rounded-[14px] border border-[rgba(238,122,58,.3)] bg-[rgba(238,122,58,.16)] text-ws-ember-bright">
        <Smartphone className="size-6" aria-hidden="true" />
      </div>

      <h2 className="text-[22px] font-medium leading-[1.2] tracking-[-0.01em] text-ws-ink">
        {t("cabinet.addPhoneGateTitle")}
      </h2>
      <p className="mt-3 max-w-[480px] text-[14.5px] leading-[1.6] text-ws-ink-soft text-pretty">
        {t("cabinet.addPhoneGateDesc")}
      </p>

      {!isCodeSent ? (
        <form
          onSubmit={handlePhoneSubmit(onPhoneSubmit)}
          noValidate
          className="mt-[22px]"
        >
          <label htmlFor="apg-phone" className="sr-only">
            {t("cabinet.phoneLabel")}
          </label>
          <div
            className={cn(
              "relative flex items-center rounded-[12px] border border-ws-line bg-[rgba(255,255,255,.025)] transition-[border-color,box-shadow] focus-within:border-ws-ember focus-within:shadow-[0_0_0_4px_rgba(238,122,58,.18)]",
              phoneErrors.phone &&
                "border-ws-red shadow-[0_0_0_4px_rgba(216,85,62,.18)]",
            )}
          >
            <Phone className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
            <span className="select-none pl-[42px] pr-1 text-[15px] font-medium text-ws-ink-mute">
              +38
            </span>
            <IMaskInput
              id="apg-phone"
              mask="000-000-00-00"
              value={phoneRaw.startsWith("+38") ? phoneRaw.slice(3) : phoneRaw}
              onAccept={handlePhoneChange}
              placeholder="0__-___-__-__"
              autoComplete="tel"
              inputMode="numeric"
              className="flex-1 bg-transparent py-[14px] pl-1 pr-[16px] font-[inherit] text-[15px] font-medium text-ws-ink placeholder:font-normal placeholder:text-ws-ink-mute focus:outline-none"
            />
          </div>
          {phoneErrors.phone && (
            <p className="mt-[7px] text-[12px] tracking-[.005em] text-ws-red-bright">
              {phoneErrors.phone.message}
            </p>
          )}
          <button
            type="submit"
            disabled={isSending}
            className="ws-btn ws-btn-primary mt-[18px]"
          >
            <Send className="size-4" aria-hidden="true" />
            {isSending ? t("cabinet.saving") : t("cabinet.getSmsCode")}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleOtpSubmit(onOtpSubmit)}
          noValidate
          className="mt-[22px]"
        >
          <p className="mb-[14px] text-ws-md font-bold tabular-nums text-ws-ink">
            {phone}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-[140px] shrink-0">
              <label htmlFor="apg-code" className="sr-only">
                {t("cabinet.smsCodeLabel")}
              </label>
              <IMaskInput
                id="apg-code"
                mask="0000"
                value={watchOtp("code")}
                onAccept={handleCodeChange}
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                placeholder="••••"
                disabled={isVerifying}
                className="w-full rounded-ws-md border border-ws-line bg-[rgba(255,255,255,.025)] px-[16px] py-[13px] text-center font-[inherit] text-ws-md font-semibold tracking-[0.4em] text-ws-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-55"
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
              onClick={resend}
              disabled={isSending}
              className="px-2 py-[13px] text-[13px] font-semibold text-ws-ember-bright hover:underline disabled:opacity-55"
            >
              {t("cabinet.resendCode")}
            </button>
          </div>
          <p className="mt-[7px] min-h-[17px] text-[12px] text-ws-red-bright">
            {otpErrors.code?.message ?? otpErrors.root?.message}
          </p>
        </form>
      )}
    </div>
  );
};
