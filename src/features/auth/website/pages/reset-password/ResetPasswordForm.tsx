import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useResetPassword } from "@/features/auth/website/hooks/useResetPassword";
import { cn } from "@/shared/lib/utils";

import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from "./reset-password.schema";

const inputWrapClass = (hasError: boolean) =>
  cn(
    "relative flex items-center rounded-[12px] border border-ws-line bg-[rgba(255,255,255,.025)] transition-[border-color,box-shadow] focus-within:border-ws-ember focus-within:shadow-[0_0_0_4px_rgba(238,122,58,.18)]",
    hasError && "border-ws-red shadow-[0_0_0_4px_rgba(216,85,62,.18)]",
  );

const inputClass =
  "w-full bg-transparent py-[14px] pr-[16px] font-[inherit] text-[15px] font-medium text-ws-ink placeholder:font-normal placeholder:text-ws-ink-mute focus:outline-none";

const labelClass =
  "mb-[9px] block text-[11px] font-semibold uppercase tracking-[.14em] text-ws-ink-mute";

interface ResetPasswordFormProps {
  token: string;
  email: string;
  onSuccess: () => void;
}

export const ResetPasswordForm = ({
  token,
  email,
  onSuccess,
}: ResetPasswordFormProps) => {
  const { t } = useTranslation("website");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(createResetPasswordSchema()),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { submit, isPending } = useResetPassword(token, email, setError);

  const onSubmit = (values: ResetPasswordFormValues) => {
    submit(values, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-[18px]">
      <div className="flex flex-col gap-[18px]">
        <div>
          <label htmlFor="reset-password" className={labelClass}>
            {t("resetPassword.password")}
          </label>
          <div className={inputWrapClass(!!errors.password)}>
            <Lock className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
            <input
              id="reset-password"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="••••••••"
              {...register("password")}
              className={cn(inputClass, "pl-[42px]")}
            />
          </div>
          {errors.password && (
            <p className="mt-[7px] text-[12px] tracking-[.005em] text-ws-red-bright">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="reset-password-confirm" className={labelClass}>
            {t("resetPassword.confirmPassword")}
          </label>
          <div className={inputWrapClass(!!errors.confirmPassword)}>
            <Lock className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
            <input
              id="reset-password-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={cn(inputClass, "pl-[42px]")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-[7px] text-[12px] tracking-[.005em] text-ws-red-bright">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
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
        {isPending ? t("resetPassword.submitting") : t("resetPassword.submit")}
      </button>
    </form>
  );
};
