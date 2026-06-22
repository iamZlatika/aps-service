import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { WebsiteModal } from "@/features/website/components/WebsiteModal";
import { useChangeEmail } from "@/features/website/modules/profile/hooks/useChangeEmail";
import {
  inputClass,
  inputWrapClass,
  labelClass,
} from "@/features/website/modules/profile/pages/components/formFieldClasses";
import {
  type ChangeEmailFormValues,
  createChangeEmailSchema,
} from "@/features/website/modules/profile/profile.schema";
import { cn } from "@/shared/lib/utils";

interface ChangeEmailModalProps {
  open: boolean;
  onClose: () => void;
}

export const ChangeEmailModal = ({ open, onClose }: ChangeEmailModalProps) => {
  const { t } = useTranslation("website");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(createChangeEmailSchema()),
  });

  const { submit, isPending } = useChangeEmail(setError);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: ChangeEmailFormValues) => {
    submit(values, {
      onSuccess: () => {
        toast.success(t("cabinet.emailChangeSent", { email: values.newEmail }));
        handleClose();
      },
    });
  };

  return (
    <WebsiteModal open={open} onClose={handleClose} maxWidth="max-w-[440px]">
      <div className="p-[34px_34px_28px]">
        <h2 className="text-[22px] font-light text-ws-ink">
          {t("cabinet.changeEmail")}
        </h2>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-dashed border-ws-ember-bright px-4 py-3 text-[12.5px] leading-[1.5] text-ws-ember-bright">
          <AlertTriangle
            className="mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          <span>{t("cabinet.changeEmailLogoutNotice")}</span>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-[18px]"
        >
          <div className="flex flex-col gap-[18px]">
            <div>
              <label htmlFor="ce-new-email" className={labelClass}>
                {t("cabinet.newEmail")}
              </label>
              <div className={inputWrapClass(!!errors.newEmail)}>
                <Mail className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
                <input
                  id="ce-new-email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  {...register("newEmail")}
                  className={cn(inputClass, "pl-[42px]")}
                />
              </div>
              {errors.newEmail && (
                <p className="mt-[7px] text-[12px] text-ws-red-bright">
                  {errors.newEmail.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="ce-current-password" className={labelClass}>
                {t("cabinet.currentPassword")}
              </label>
              <div className={inputWrapClass(!!errors.currentPassword)}>
                <Lock className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
                <input
                  id="ce-current-password"
                  type="password"
                  autoComplete="current-password"
                  {...register("currentPassword")}
                  className={cn(inputClass, "pl-[42px]")}
                />
              </div>
              {errors.currentPassword && (
                <p className="mt-[7px] text-[12px] text-ws-red-bright">
                  {errors.currentPassword.message}
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
            {isPending ? t("cabinet.saving") : t("cabinet.save")}
          </button>
        </form>
      </div>
    </WebsiteModal>
  );
};
