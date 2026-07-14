import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";

import { useAddPhoneFlow } from "@/features/website/hooks/useAddPhoneFlow";
import {
  type AddPhoneFormValues,
  createAddPhoneSchema,
} from "@/features/website/lib/phoneFlow.schema";
import { extractLocalPhoneDigits } from "@/shared/lib/phone";
import { cn, stripNonDigits } from "@/shared/lib/utils";

import { AddPhoneOtpForm } from "./AddPhoneOtpForm";

interface PhoneFlowFormProps {
  inputId: string;
  onVerifySuccess: () => void;
  submitButtonClass?: string;
}

export const PhoneFlowForm = ({
  inputId,
  onVerifySuccess,
  submitButtonClass,
}: PhoneFlowFormProps) => {
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
    const digits = stripNonDigits(masked);
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
    <>
      <form onSubmit={handleSubmit(onPhoneSubmit)} noValidate>
        <label htmlFor={inputId} className="sr-only">
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
            id={inputId}
            mask="000-000-00-00"
            value={phoneRaw.startsWith("+38") ? phoneRaw.slice(3) : phoneRaw}
            prepare={extractLocalPhoneDigits}
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
            className={cn("ws-btn ws-btn-primary mt-[18px]", submitButtonClass)}
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
          onVerifySuccess={onVerifySuccess}
        />
      )}
    </>
  );
};
