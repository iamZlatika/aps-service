import type { UseFormSetError } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useRoles } from "@/features/backoffice/modules/roles-permissions/hooks/useRoles.ts";
import RegisterUserTextField from "@/features/backoffice/modules/users/components/RegisterUserTextField.tsx";
import { RolesPermissionsPicker } from "@/features/backoffice/modules/users/components/RolesPermissionsPicker.tsx";
import { useRegisterUserForm } from "@/features/backoffice/modules/users/hooks/useRegisterUserForm.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";

interface RegisterUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (
    values: Record<string, unknown>,
    setError: UseFormSetError<Record<string, string>>,
  ) => void;
  isPending: boolean;
}

export const RegisterUserDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isPending,
}: RegisterUserDialogProps) => {
  const { t } = useTranslation();
  const { roles: rolesData } = useRoles(isOpen);
  const {
    register,
    errors,
    localRoles,
    localAbilities,
    toggleRole,
    togglePermission,
    isAbilityFromRole,
    rolesError,
    onSubmit,
  } = useRegisterUserForm(isOpen, rolesData, onConfirm);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("users.register_form.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <RegisterUserTextField
              id="register-user-email"
              label={t("users.register_form.email")}
              placeholder={t("users.register_form.email_placeholder")}
              type="email"
              registration={register("email")}
              error={errors.email?.message}
            />
            <RegisterUserTextField
              id="register-user-name"
              label={t("users.register_form.name")}
              placeholder={t("users.register_form.name_placeholder")}
              registration={register("name")}
              error={errors.name?.message}
            />
            <RegisterUserTextField
              id="register-user-password"
              label={t("users.register_form.password")}
              placeholder={t("users.register_form.password_placeholder")}
              type="password"
              registration={register("password")}
              error={errors.password?.message}
            />
            <RegisterUserTextField
              id="register-user-password-confirmation"
              label={t("users.register_form.password_confirmation")}
              placeholder={t(
                "users.register_form.password_confirmation_placeholder",
              )}
              type="password"
              registration={register("password_confirmation")}
              error={errors.password_confirmation?.message}
            />
          </div>

          <RolesPermissionsPicker
            localRoles={localRoles}
            localAbilities={localAbilities}
            isAbilityFromRole={isAbilityFromRole}
            toggleRole={toggleRole}
            togglePermission={togglePermission}
            isPending={false}
            rolesData={rolesData}
          />
          {rolesError && (
            <span className="text-xs text-red-500">{rolesError}</span>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("users.register_form.cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isPending}
            >
              {isPending
                ? t("loader.default")
                : t("users.register_form.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
