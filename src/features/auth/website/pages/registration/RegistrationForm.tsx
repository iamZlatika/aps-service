import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, Phone, User } from "lucide-react";
import { type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";

import { handleFormError } from "@/shared/lib/errors/handleFormError";
import { cn } from "@/shared/lib/utils";

import {
  createRegistrationSchema,
  type RegistrationFormValues,
} from "./registration.schema";
import { useRegistration } from "./useRegistration";

function getPasswordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const STRENGTH_COLORS = ["#d8553e", "#e0a64a", "#c9b24a", "#5fcf78"] as const;

const inputWrapClass = (hasError: boolean) =>
  cn(
    "relative flex items-center rounded-[12px] border border-ws-line bg-[rgba(255,255,255,.025)] transition-[border-color,box-shadow] focus-within:border-ws-ember focus-within:shadow-[0_0_0_4px_rgba(238,122,58,.18)]",
    hasError && "border-ws-red shadow-[0_0_0_4px_rgba(216,85,62,.18)]",
  );

const inputClass =
  "w-full bg-transparent py-[14px] pr-[16px] font-[inherit] text-[15px] font-medium text-ws-ink placeholder:font-normal placeholder:text-ws-ink-mute focus:outline-none";

const labelClass =
  "mb-[9px] block text-[11px] font-semibold uppercase tracking-[.14em] text-ws-ink-mute";

interface FieldProps {
  children: ReactNode;
  error?: string;
  hint?: string;
}

const Field = ({ children, error, hint }: FieldProps) => (
  <div>
    {children}
    {error && (
      <p className="mt-[7px] text-[12px] tracking-[.005em] text-ws-red-bright">
        {error}
      </p>
    )}
    {!error && hint && (
      <p className="mt-[7px] text-[11.5px] tracking-[.01em] text-ws-ink-mute">
        {hint}
      </p>
    )}
  </div>
);

interface RegistrationFormProps {
  onSuccess: (email: string) => void;
}

export const RegistrationForm = ({ onSuccess }: RegistrationFormProps) => {
  const { t } = useTranslation("website");

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(createRegistrationSchema()),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const { submit, isPending } = useRegistration();

  const onSubmit = (values: RegistrationFormValues) => {
    submit(values, {
      onSuccess: () => onSuccess(values.email),
      onError: (error) =>
        handleFormError<RegistrationFormValues>(error, setError, {
          fieldMap: { password_confirmation: "passwordConfirmation" },
        }),
    });
  };

  const password = watch("password");
  const strength = getPasswordStrength(password);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-[18px]">
      <div className="flex flex-col gap-[18px]">
        <Field error={errors.name?.message}>
          <label htmlFor="reg-name" className={labelClass}>
            {t("registration.name")}
          </label>
          <div className={inputWrapClass(!!errors.name)}>
            <User className="absolute left-[14px] size-4 shrink-0 text-ws-ink-mute pointer-events-none" />
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              autoFocus
              placeholder="Олександр Петренко"
              {...register("name")}
              className={cn(inputClass, "pl-[42px]")}
            />
          </div>
        </Field>

        <Field error={errors.email?.message} hint={t("registration.emailHint")}>
          <label htmlFor="reg-email" className={labelClass}>
            {t("registration.email")}
          </label>
          <div className={inputWrapClass(!!errors.email)}>
            <Mail className="absolute left-[14px] size-4 shrink-0 text-ws-ink-mute pointer-events-none" />
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              {...register("email")}
              className={cn(inputClass, "pl-[42px]")}
            />
          </div>
        </Field>

        <Field error={errors.phone?.message} hint={t("registration.phoneHint")}>
          <label htmlFor="reg-phone" className={labelClass}>
            {t("registration.phone")}
          </label>
          <div className={inputWrapClass(!!errors.phone)}>
            <Phone className="absolute left-[14px] size-4 shrink-0 text-ws-ink-mute pointer-events-none" />
            <span className="select-none pl-[42px] pr-1 text-[15px] font-medium text-ws-ink-mute">
              +38
            </span>
            <IMaskInput
              id="reg-phone"
              mask="000-000-00-00"
              value={
                watch("phone").startsWith("+38")
                  ? watch("phone").slice(3)
                  : watch("phone")
              }
              onAccept={(masked: string) => {
                const digits = masked.replace(/\D/g, "");
                setValue("phone", digits ? "+38" + digits : "", {
                  shouldValidate: true,
                });
              }}
              placeholder="0__-___-__-__"
              autoComplete="tel"
              className={cn(inputClass, "flex-1 pl-1")}
            />
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-[14px]">
          <Field error={errors.password?.message}>
            <label htmlFor="reg-password" className={labelClass}>
              {t("registration.password")}
            </label>
            <div className={inputWrapClass(!!errors.password)}>
              <Lock className="absolute left-[14px] size-4 shrink-0 text-ws-ink-mute pointer-events-none" />
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register("password")}
                className={cn(inputClass, "pl-[42px]")}
              />
            </div>
            <div className="mt-[10px] flex gap-[5px]">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="h-[4px] flex-1 rounded-[2px] transition-colors duration-200"
                  style={{
                    background:
                      password && i < strength
                        ? STRENGTH_COLORS[strength - 1]
                        : "var(--ws-line)",
                  }}
                />
              ))}
            </div>
          </Field>

          <Field error={errors.passwordConfirmation?.message}>
            <label htmlFor="reg-password-confirm" className={labelClass}>
              {t("registration.passwordConfirmation")}
            </label>
            <div className={inputWrapClass(!!errors.passwordConfirmation)}>
              <Lock className="absolute left-[14px] size-4 shrink-0 text-ws-ink-mute pointer-events-none" />
              <input
                id="reg-password-confirm"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register("passwordConfirmation")}
                className={cn(inputClass, "pl-[42px]")}
              />
            </div>
          </Field>
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
        {isPending ? t("registration.submitting") : t("registration.submit")}
      </button>
    </form>
  );
};
