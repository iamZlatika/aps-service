import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import PasswordChangedDialog from "@/features/profile/components/PasswordChangedDialog.tsx";
import { useChangePassword } from "@/features/profile/hooks/useChangePassword.ts";
import {
  type ChangePasswordFormValues,
  createProfileSchema,
} from "@/features/profile/profile.schema.ts";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { Loader } from "@/shared/components/common/Loader.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
  const { t } = useTranslation();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const schema = useMemo(() => createProfileSchema(), []);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const { changePassword, isPending } = useChangePassword(setError, () => {
    handleClose();
    setIsSuccessOpen(true);
  });

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("profile.change_form.change_password")}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {t("profile.change_form.change_password")}
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <form
              onSubmit={handleSubmit((data) => changePassword(data))}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">
                  {t("profile.change_form.enter_old_password")}
                </Label>
                <FormField
                  id="currentPassword"
                  type="password"
                  error={errors.currentPassword}
                  {...register("currentPassword")}
                />
                <Label htmlFor="newPassword">
                  {t("profile.change_form.enter_new_password")}
                </Label>
                <FormField
                  id="newPassword"
                  type="password"
                  error={errors.newPassword}
                  {...register("newPassword")}
                />
                <Label htmlFor="confirmPassword">
                  {t("profile.change_form.confirm_new_password")}
                </Label>
                <FormField
                  id="confirmPassword"
                  type="password"
                  error={errors.confirmPassword}
                  {...register("confirmPassword")}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? t("loader.default") : t("common.save")}
              </Button>
            </form>
            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-md">
                <Loader />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <PasswordChangedDialog
        open={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
      />
    </>
  );
};

export default ChangePasswordModal;
