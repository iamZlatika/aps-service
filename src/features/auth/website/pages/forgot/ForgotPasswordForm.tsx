import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useForgotPassword } from "@/features/auth/website/hooks/useForgotPassword";
import { cn } from "@/shared/lib/utils";

import { createForgotSchema, type ForgotFormValues } from "./forgot.schema";

const inputWrapClass = (hasError: boolean) =>
  cn(
    "relative flex items-center rounded-[12px] border border-ws-line bg-[rgba(255,255,255,.025)] transition-[border-color,box-shadow] focus-within:border-ws-ember focus-within:shadow-[0_0_0_4px_rgba(238,122,58,.18)]",
    hasError && "border-ws-red shadow-[0_0_0_4px_rgba(216,85,62,.18)]",
  );

const inputClass =
  "w-full bg-transparent py-[14px] pr-[16px] font-[inherit] text-[15px] font-medium text-ws-ink placeholder:font-normal placeholder:text-ws-ink-mute focus:outline-none";

const labelClass =
  "mb-[9px] block text-[11px] font-semibold uppercase tracking-[.14em] text-ws-ink-mute";

interface ForgotPasswordFormProps {
  onSuccess: () => void;
}

export const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const { t } = useTranslation("website");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(createForgotSchema()),
    defaultValues: { email: "" },
  });

  const { submit, isPending } = useForgotPassword(setError);

  const onSubmit = (values: ForgotFormValues) => {
    submit(values, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-[18px]">
      <div>
        <label htmlFor="forgot-email" className={labelClass}>
          {t("forgotPassword.email")}
        </label>
        <div className={inputWrapClass(!!errors.email)}>
          <Mail className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="you@email.com"
            {...register("email")}
            className={cn(inputClass, "pl-[42px]")}
          />
        </div>
        {errors.email && (
          <p className="mt-[7px] text-[12px] tracking-[.005em] text-ws-red-bright">
            {errors.email.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p className="mt-4 text-[12px] text-ws-red-bright">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="ws-btn ws-btn-primary mt-5 w-full justify-center"
      >
        {isPending
          ? t("forgotPassword.submitting")
          : t("forgotPassword.submit")}
      </button>
    </form>
  );
};
