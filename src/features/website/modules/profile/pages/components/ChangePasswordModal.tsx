import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { WebsiteModal } from "@/features/website/components/WebsiteModal";
import { useChangePassword } from "@/features/website/modules/profile/hooks/useChangePassword";
import {
  inputClass,
  inputWrapClass,
  labelClass,
} from "@/features/website/modules/profile/pages/components/formFieldClasses";
import {
  type ChangePasswordFormValues,
  createChangePasswordSchema,
} from "@/features/website/modules/profile/profile.schema";
import { cn } from "@/shared/lib/utils";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({
  open,
  onClose,
}: ChangePasswordModalProps) => {
  const { t } = useTranslation("website");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(createChangePasswordSchema()),
  });

  const { submit, isPending } = useChangePassword(setError);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: ChangePasswordFormValues) => {
    submit(values, {
      onSuccess: () => {
        toast.success(t("cabinet.passwordChanged"));
        handleClose();
      },
    });
  };

  return (
    <WebsiteModal open={open} onClose={handleClose} maxWidth="max-w-[440px]">
      <div className="p-[34px_34px_28px]">
        <h2 className="text-[22px] font-light text-ws-ink">
          {t("cabinet.changePassword")}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-[18px]"
        >
          <div className="flex flex-col gap-[18px]">
            <div>
              <label htmlFor="cp-current" className={labelClass}>
                {t("cabinet.currentPassword")}
              </label>
              <div className={inputWrapClass(!!errors.currentPassword)}>
                <Lock className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
                <input
                  id="cp-current"
                  type="password"
                  autoComplete="current-password"
                  autoFocus
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

            <div>
              <label htmlFor="cp-new" className={labelClass}>
                {t("cabinet.newPassword")}
              </label>
              <div className={inputWrapClass(!!errors.newPassword)}>
                <Lock className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
                <input
                  id="cp-new"
                  type="password"
                  autoComplete="new-password"
                  {...register("newPassword")}
                  className={cn(inputClass, "pl-[42px]")}
                />
              </div>
              {errors.newPassword && (
                <p className="mt-[7px] text-[12px] text-ws-red-bright">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cp-confirm" className={labelClass}>
                {t("cabinet.confirmNewPassword")}
              </label>
              <div className={inputWrapClass(!!errors.confirmPassword)}>
                <Lock className="pointer-events-none absolute left-[14px] size-4 shrink-0 text-ws-ink-mute" />
                <input
                  id="cp-confirm"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className={cn(inputClass, "pl-[42px]")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-[7px] text-[12px] text-ws-red-bright">
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
            {isPending ? t("cabinet.saving") : t("cabinet.save")}
          </button>
        </form>
      </div>
    </WebsiteModal>
  );
};
