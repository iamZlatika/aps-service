import { Lock } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { cn } from "@/shared/lib/utils";

import { PasswordStrengthBars } from "./PasswordStrengthBars";

const inputWrapClass = (hasError: boolean) =>
  cn(
    "relative flex items-center rounded-[12px] border border-ws-line bg-[rgba(255,255,255,.025)] transition-[border-color,box-shadow] focus-within:border-ws-ember focus-within:shadow-[0_0_0_4px_rgba(238,122,58,.18)]",
    hasError && "border-ws-red shadow-[0_0_0_4px_rgba(216,85,62,.18)]",
  );

const inputClass =
  "w-full bg-transparent py-[14px] pr-[16px] font-[inherit] text-[15px] font-medium text-ws-ink placeholder:font-normal placeholder:text-ws-ink-mute focus:outline-none";

const labelClass =
  "mb-[9px] block text-[11px] font-semibold uppercase tracking-[.14em] text-ws-ink-mute";

interface RegistrationPasswordFieldsProps {
  passwordProps: UseFormRegisterReturn;
  confirmProps: UseFormRegisterReturn;
  passwordError?: string;
  confirmError?: string;
  strength: number;
}

export const RegistrationPasswordFields = ({
  passwordProps,
  confirmProps,
  passwordError,
  confirmError,
  strength,
}: RegistrationPasswordFieldsProps) => {
  const { t } = useTranslation("website");

  return (
    <div className="grid grid-cols-2 gap-[14px]">
      <div>
        <label htmlFor="reg-password" className={labelClass}>
          {t("registration.password")}
        </label>
        <div className={inputWrapClass(!!passwordError)}>
          <Lock className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            {...passwordProps}
            className={cn(inputClass, "pl-[42px]")}
          />
        </div>
        <PasswordStrengthBars strength={strength} />
        {passwordError && (
          <p className="mt-[7px] text-[12px] tracking-[.005em] text-ws-red-bright">
            {passwordError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="reg-password-confirm" className={labelClass}>
          {t("registration.passwordConfirmation")}
        </label>
        <div className={inputWrapClass(!!confirmError)}>
          <Lock className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
          <input
            id="reg-password-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            {...confirmProps}
            className={cn(inputClass, "pl-[42px]")}
          />
        </div>
        {confirmError && (
          <p className="mt-[7px] text-[12px] tracking-[.005em] text-ws-red-bright">
            {confirmError}
          </p>
        )}
      </div>
    </div>
  );
};
