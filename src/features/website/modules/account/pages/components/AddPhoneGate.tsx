import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Send, Smartphone } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";

import { useAddPhoneFlow } from "@/features/website/modules/account/hooks/useAddPhoneFlow";
import {
  type AddPhoneFormValues,
  createAddPhoneSchema,
} from "@/features/website/modules/account/pages/components/addPhoneGate.schema";
import { AddPhoneOtpForm } from "@/features/website/modules/account/pages/components/AddPhoneOtpForm";
import { cn } from "@/shared/lib/utils";

export const AddPhoneGate = () => {
  const { t } = useTranslation("website");
  const { isCodeSent, phone, submitPhone, resend, isSending, countdown } =
    useAddPhoneFlow();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddPhoneFormValues>({
    resolver: zodResolver(createAddPhoneSchema()),
    defaultValues: { phone: "" },
  });

  const handlePhoneChange = (masked: string) => {
    const digits = masked.replace(/\D/g, "");
    setValue("phone", digits ? "+38" + digits : "", { shouldValidate: false });
  };

  const onPhoneSubmit = (values: AddPhoneFormValues) => {
    submitPhone(values.phone, {
      onSuccess: () =>
        toast.success(t("cabinet.smsCodeSent", { phone: values.phone })),
    });
  };

  const phoneRaw = watch("phone");

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

      <form
        onSubmit={handleSubmit(onPhoneSubmit)}
        noValidate
        className="mt-[22px]"
      >
        <label htmlFor="apg-phone" className="sr-only">
          {t("cabinet.phoneLabel")}
        </label>
        <div
          className={cn(
            "relative flex items-center rounded-[12px] border border-ws-line bg-ws-input-bg transition-[border-color,box-shadow]",
            !isCodeSent &&
              "focus-within:border-ws-ember focus-within:shadow-[0_0_0_4px_rgba(238,122,58,.18)]",
            errors.phone &&
              "border-ws-red shadow-[0_0_0_4px_rgba(216,85,62,.18)]",
            isCodeSent && "opacity-60",
          )}
        >
          <Phone
            className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute"
            aria-hidden="true"
          />
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
            readOnly={isCodeSent}
            className="flex-1 bg-transparent py-[14px] pl-1 pr-[16px] font-[inherit] text-[15px] font-medium text-ws-ink placeholder:font-normal placeholder:text-ws-ink-mute focus:outline-none read-only:cursor-default"
          />
        </div>
        {errors.phone && (
          <p className="mt-[7px] text-[12px] tracking-[.005em] text-ws-red-bright">
            {errors.phone.message}
          </p>
        )}
        {!isCodeSent && (
          <button
            type="submit"
            disabled={isSending}
            className="ws-btn ws-btn-primary mt-[18px]"
          >
            <Send className="size-4" aria-hidden="true" />
            {isSending ? t("cabinet.saving") : t("cabinet.sendSmsCode")}
          </button>
        )}
      </form>

      {isCodeSent && (
        <AddPhoneOtpForm
          phone={phone}
          countdown={countdown}
          resend={resend}
          isSending={isSending}
          onVerifySuccess={() => toast.success(t("cabinet.phoneVerified"))}
        />
      )}
    </div>
  );
};
