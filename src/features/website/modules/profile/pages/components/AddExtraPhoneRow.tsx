import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Phone, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IMaskInput } from "react-imask";

import {
  createExtraPhoneSchema,
  type ExtraPhoneFormValues,
} from "@/features/website/modules/profile/pages/components/addExtraPhoneRow.schema";
import { extractLocalPhoneDigits } from "@/shared/lib/phone";
import { cn, stripNonDigits } from "@/shared/lib/utils";

interface AddExtraPhoneRowProps {
  onConfirm: (phone: string) => void;
  onCancel: () => void;
  isPending: boolean;
}

export const AddExtraPhoneRow = ({
  onConfirm,
  onCancel,
  isPending,
}: AddExtraPhoneRowProps) => {
  const { t } = useTranslation("website");

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExtraPhoneFormValues>({
    resolver: zodResolver(createExtraPhoneSchema()),
    defaultValues: { phone: "" },
  });

  const handlePhoneChange = (masked: string) => {
    const digits = stripNonDigits(masked);
    setValue("phone", digits ? "+38" + digits : "", { shouldValidate: false });
  };

  const onSubmit = (values: ExtraPhoneFormValues) => {
    onConfirm(values.phone);
  };

  const phoneRaw = watch("phone");

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div
          className={cn(
            "relative flex items-center rounded-ws-md border border-ws-line bg-ws-input-bg transition-[border-color,box-shadow] focus-within:border-ws-ember focus-within:shadow-[0_0_0_4px_rgba(238,122,58,.18)]",
            errors.phone &&
              "border-ws-red shadow-[0_0_0_4px_rgba(216,85,62,.18)]",
          )}
        >
          <Phone
            className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute"
            aria-hidden="true"
          />
          <span className="select-none pl-[42px] pr-1 text-ws-md font-medium text-ws-ink-mute">
            +38
          </span>
          <label htmlFor="add-extra-phone" className="sr-only">
            {t("cabinet.phoneLabel")}
          </label>
          <IMaskInput
            id="add-extra-phone"
            mask="000-000-00-00"
            value={phoneRaw.startsWith("+38") ? phoneRaw.slice(3) : phoneRaw}
            prepare={extractLocalPhoneDigits}
            onAccept={handlePhoneChange}
            placeholder="0__-___-__-__"
            autoComplete="tel"
            inputMode="numeric"
            autoFocus
            disabled={isPending}
            className="flex-1 bg-transparent py-[13px] pl-1 pr-[76px] font-[inherit] text-ws-md font-medium text-ws-ink placeholder:font-normal placeholder:text-ws-ink-mute focus:outline-none disabled:opacity-55"
          />
          <div className="absolute right-[8px] flex items-center gap-[4px]">
            <button
              type="submit"
              disabled={isPending}
              aria-label={t("cabinet.confirmPhone")}
              className="inline-flex size-[32px] items-center justify-center rounded-[8px] text-ws-ink-mute transition-colors duration-150 hover:text-ws-green-bright disabled:opacity-55"
            >
              <Check className="size-[15px]" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              aria-label={t("cabinet.cancel")}
              className="inline-flex size-[32px] items-center justify-center rounded-[8px] text-ws-ink-mute transition-colors duration-150 hover:text-ws-ink disabled:opacity-55"
            >
              <X className="size-[15px]" aria-hidden="true" />
            </button>
          </div>
        </div>
        {errors.phone && (
          <p className="mt-[7px] text-[12px] tracking-[.005em] text-ws-red-bright">
            {errors.phone.message}
          </p>
        )}
      </form>
    </div>
  );
};
