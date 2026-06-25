import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";

import { cn } from "@/shared/lib/utils";

const inputWrapClass = (hasError: boolean) =>
  cn(
    "relative flex items-center rounded-[12px] border border-ws-line bg-ws-input-bg transition-[border-color,box-shadow] focus-within:border-ws-ember focus-within:shadow-[0_0_0_4px_rgba(238,122,58,.18)]",
    hasError && "border-ws-red shadow-[0_0_0_4px_rgba(216,85,62,.18)]",
  );

const inputClass =
  "w-full bg-transparent py-[14px] pr-[16px] font-[inherit] text-[15px] font-medium text-ws-ink placeholder:font-normal placeholder:text-ws-ink-mute focus:outline-none";

const labelClass =
  "mb-[9px] block text-[11px] font-semibold uppercase tracking-[.14em] text-ws-ink-mute";

interface RegistrationPhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
}

export const RegistrationPhoneField = ({
  value,
  onChange,
  error,
  hint,
}: RegistrationPhoneFieldProps) => {
  const { t } = useTranslation("website");

  return (
    <div>
      <label htmlFor="reg-phone" className={labelClass}>
        {t("registration.phone")}
      </label>
      <div className={inputWrapClass(!!error)}>
        <Phone className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
        <span className="select-none pl-[42px] pr-1 text-[15px] font-medium text-ws-ink-mute">
          +38
        </span>
        <IMaskInput
          id="reg-phone"
          mask="000-000-00-00"
          value={value.startsWith("+38") ? value.slice(3) : value}
          onAccept={(masked: string) => {
            const digits = masked.replace(/\D/g, "");
            onChange(digits ? "+38" + digits : "");
          }}
          placeholder="0__-___-__-__"
          autoComplete="tel"
          className={cn(inputClass, "flex-1 pl-1")}
        />
      </div>
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
};
