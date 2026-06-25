import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { type AuthResponse } from "@/features/auth/website/types";
import { handleFormError } from "@/shared/lib/errors/handleFormError";
import { isApiError } from "@/shared/lib/errors/services";
import { cn } from "@/shared/lib/utils";

import { createLoginSchema, type LoginFormValues } from "./login.schema";
import { useLogin } from "./useLogin";

const inputWrapClass = (hasError: boolean) =>
  cn(
    "relative flex items-center rounded-[12px] border border-ws-line bg-ws-input-bg transition-[border-color,box-shadow] focus-within:border-ws-ember focus-within:shadow-[0_0_0_4px_rgba(238,122,58,.18)]",
    hasError && "border-ws-red shadow-[0_0_0_4px_rgba(216,85,62,.18)]",
  );

const inputClass =
  "w-full bg-transparent py-[14px] pr-[16px] font-[inherit] text-[15px] font-medium text-ws-ink placeholder:font-normal placeholder:text-ws-ink-mute focus:outline-none";

const labelClass =
  "mb-[9px] block text-[11px] font-semibold uppercase tracking-[.14em] text-ws-ink-mute";

interface LoginFormProps {
  onSuccess: (data: AuthResponse) => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({ onSuccess, onForgotPassword }: LoginFormProps) => {
  const { t } = useTranslation("website");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema()),
    defaultValues: { email: "", password: "" },
  });

  const { submit, isPending } = useLogin();

  const onSubmit = (values: LoginFormValues) => {
    submit(values, {
      onSuccess,
      onError: (error) => {
        if (isApiError(error) && error.status === 403) {
          setError("root", { message: t("login.emailNotVerified") });
        } else {
          handleFormError<LoginFormValues>(error, setError);
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-[18px]">
      <div className="flex flex-col gap-[18px]">
        <div>
          <label htmlFor="login-email" className={labelClass}>
            {t("login.email")}
          </label>
          <div className={inputWrapClass(!!errors.email)}>
            <Mail className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
            <input
              id="login-email"
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

        <div>
          <label htmlFor="login-password" className={labelClass}>
            {t("login.password")}
          </label>
          <div className={inputWrapClass(!!errors.password)}>
            <Lock className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
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
      </div>

      <div className="mt-[12px] flex justify-end">
        <button
          type="button"
          className="text-[13px] font-medium text-ws-ember-bright hover:underline"
          onClick={onForgotPassword}
        >
          {t("login.forgotPassword")}
        </button>
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
        {isPending ? t("login.submitting") : t("login.submit")}
      </button>
    </form>
  );
};
