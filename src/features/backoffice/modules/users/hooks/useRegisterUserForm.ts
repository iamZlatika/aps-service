import { zodResolver } from "@hookform/resolvers/zod";
import type { BaseSyntheticEvent } from "react";
import { useEffect, useState } from "react";
import {
  type FieldErrors,
  useForm,
  type UseFormRegister,
  type UseFormSetError,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { usePermissionsSelection } from "@/features/backoffice/modules/users/hooks/usePermissionsSelection.ts";
import { registerUserFieldsSchema } from "@/features/backoffice/modules/users/lib/registerUserSchema.ts";
import type { RoleWithPermissions } from "@/features/backoffice/modules/users/types.ts";

export type RegisterUserFormValues = {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
};

const EMPTY_FORM_VALUES: RegisterUserFormValues = {
  email: "",
  name: "",
  password: "",
  password_confirmation: "",
};

type UseRegisterUserFormReturn = {
  register: UseFormRegister<RegisterUserFormValues>;
  errors: FieldErrors<RegisterUserFormValues>;
  localRoles: string[];
  localAbilities: string[];
  toggleRole: (role: string) => void;
  togglePermission: (permission: string) => void;
  isAbilityFromRole: (ability: string) => boolean;
  rolesError: string | null;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
};

export const useRegisterUserForm = (
  isOpen: boolean,
  rolesData: RoleWithPermissions[],
  onConfirm: (
    values: Record<string, unknown>,
    setError: UseFormSetError<Record<string, string>>,
  ) => void,
): UseRegisterUserFormReturn => {
  const { t } = useTranslation();
  const [rolesError, setRolesError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<RegisterUserFormValues>({
    resolver: zodResolver(registerUserFieldsSchema),
    defaultValues: EMPTY_FORM_VALUES,
  });

  const {
    localRoles,
    localPermissions,
    localAbilities,
    toggleRole,
    togglePermission,
    isAbilityFromRole,
    resetSelection,
  } = usePermissionsSelection([], [], rolesData);

  useEffect(() => {
    if (isOpen) {
      reset(EMPTY_FORM_VALUES);
      resetSelection([], []);
      setRolesError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onSubmit = handleSubmit((basicFields) => {
    if (localRoles.length === 0) {
      setRolesError(t("validation.field_required"));
      return;
    }
    setRolesError(null);
    onConfirm(
      { ...basicFields, roles: localRoles, permissions: localPermissions },
      setError as UseFormSetError<Record<string, string>>,
    );
  });

  return {
    register,
    errors,
    localRoles,
    localAbilities,
    toggleRole,
    togglePermission,
    isAbilityFromRole,
    rolesError,
    onSubmit,
  };
};
