import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Pencil, User, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { type Customer } from "@/features/auth/website/types";
import { useUpdateProfileName } from "@/features/website/modules/profile/hooks/useUpdateProfileName";
import {
  createProfileNameSchema,
  type ProfileNameFormValues,
} from "@/features/website/modules/profile/profile.schema";
import { cn } from "@/shared/lib/utils";

interface ProfileNameFieldProps {
  customer: Customer;
}

const labelClass =
  "mb-[9px] block text-[11px] font-semibold uppercase tracking-[.14em] text-ws-ink-mute";

const fieldClass =
  "w-full truncate rounded-ws-md border border-ws-line bg-ws-input-bg py-[13px] pl-[42px] font-[inherit] text-ws-md font-medium text-ws-ink focus:outline-none focus:ring-1 focus:ring-ws-ember-bright";

export const ProfileNameField = ({ customer }: ProfileNameFieldProps) => {
  const { t } = useTranslation("website");
  const [isEditing, setIsEditing] = useState(false);
  const displayName = customer.portalName ?? t("cabinet.defaultName");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ProfileNameFormValues>({
    resolver: zodResolver(createProfileNameSchema()),
    defaultValues: { portalName: displayName },
  });

  const { submit, isPending } = useUpdateProfileName(setError);

  const onSubmit = (values: ProfileNameFormValues) => {
    submit(values, {
      onSuccess: () => {
        toast.success(t("cabinet.nameUpdated"));
        setIsEditing(false);
      },
    });
  };

  if (!isEditing) {
    return (
      <div className="mb-4">
        <label className={labelClass}>{t("cabinet.name")}</label>
        <div className="relative flex items-center">
          <span className="pointer-events-none absolute left-[14px] text-ws-ink-mute">
            <User className="size-4" aria-hidden="true" />
          </span>
          <div className={cn(fieldClass, "pr-[40px]")}>{displayName}</div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label={t("cabinet.editName")}
            className="absolute right-[14px] text-ws-ink-mute transition-colors hover:text-ws-ink"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      <label htmlFor="pf-name" className={labelClass}>
        {t("cabinet.name")}
      </label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-[14px] text-ws-ink-mute">
          <User className="size-4" aria-hidden="true" />
        </span>
        <input
          id="pf-name"
          type="text"
          autoFocus
          disabled={isPending}
          className={cn(fieldClass, "pr-[76px]")}
          {...register("portalName")}
        />
        <div className="absolute right-[10px] flex items-center gap-1">
          <button
            type="submit"
            disabled={isPending}
            aria-label={t("cabinet.save")}
            className="flex size-7 items-center justify-center rounded-ws-sm text-ws-green-bright transition-colors hover:bg-ws-green/10 disabled:opacity-55"
          >
            <Check className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setIsEditing(false);
            }}
            aria-label={t("cabinet.cancel")}
            className="flex size-7 items-center justify-center rounded-ws-sm text-ws-ink-mute transition-colors hover:bg-white/5 hover:text-ws-ink"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      {errors.portalName && (
        <p className="mt-[7px] text-[12px] text-ws-red-bright">
          {errors.portalName.message}
        </p>
      )}
    </form>
  );
};
