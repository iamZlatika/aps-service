import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
import { type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { handleFormError } from "@/shared/lib/errors/handleFormError";
import { cn } from "@/shared/lib/utils";

import {
  createRegistrationSchema,
  type RegistrationFormValues,
} from "./registration.schema";
import { RegistrationPasswordFields } from "./RegistrationPasswordFields";
import { RegistrationPhoneField } from "./RegistrationPhoneField";
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
      onSuccess: (data) => onSuccess(data.email),
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
            <User className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
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
            <Mail className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
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

        <RegistrationPhoneField
          value={watch("phone")}
          onChange={(value) =>
            setValue("phone", value, { shouldValidate: true })
          }
          error={errors.phone?.message}
          hint={t("registration.phoneHint")}
        />

        <RegistrationPasswordFields
          passwordProps={register("password")}
          confirmProps={register("passwordConfirmation")}
          passwordError={errors.password?.message}
          confirmError={errors.passwordConfirmation?.message}
          strength={strength}
        />
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
