import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { type UseFormSetError } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AddButton } from "@/features/backoffice/modules/dictionaries/components/AddButton.tsx";
import { usersApi } from "@/features/backoffice/modules/users/api";
import { getUserRoleOptions } from "@/features/backoffice/modules/users/data.ts";
import { registerUserSchema } from "@/features/backoffice/modules/users/lib/registerUserSchema.ts";
import {
  type NewUser,
  type User,
} from "@/features/backoffice/modules/users/types.ts";
import { SmartTable } from "@/features/backoffice/widgets/table";
import {
  DeleteConfirmDialog,
  ItemFormDialog,
} from "@/features/backoffice/widgets/table/components/dialogs";
import type {
  BaseItem,
  ColumnConfig,
  FieldConfig,
} from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { UserStatusButton } from "@/shared/components/common/UserStatusButton.tsx";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { type UserStatus } from "@/shared/types.ts";

const UsersPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const columns: ColumnConfig<User>[] = [
    { key: "name", labelKey: "users.table_fields.name", sortable: false },
    {
      key: "role",
      labelKey: "users.table_fields.role",
      sortable: true,
      type: "select",
      options: getUserRoleOptions(t),
    },
    {
      key: "status",
      labelKey: "users.table_fields.status",
      sortable: true,
      className: "text-right [&>*]:ml-auto [&>div]:justify-end",
      renderCell: (value, item) => (
        <UserStatusButton
          status={String(value)}
          onClick={() => handleStatusClick(item)}
        />
      ),
    },
  ];

  const [targetUser, setTargetUser] = useState<User | null>(null);
  const isActive = targetUser?.status === "active";
  const newStatus: UserStatus = isActive ? "blocked" : "active";

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: UserStatus }) =>
      usersApi.updateUserStatus(id, status),
    onSuccess: () => {
      setTargetUser(null);
      return queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  const handleStatusClick = useCallback((item: User) => {
    setTargetUser(item);
  }, []);

  const handleConfirm = useCallback(() => {
    if (targetUser) {
      statusMutation.mutate({ id: targetUser.id, status: newStatus });
    }
  }, [targetUser, newStatus, statusMutation]);

  const [isAddOpen, setIsAddOpen] = useState(false);

  const registerMutation = useMutation({
    mutationFn: (data: NewUser) => usersApi.registerUser(data),
    onSuccess: () => {
      setIsAddOpen(false);
      return queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  const handleRegisterSubmit = useCallback(
    async (
      values: Partial<BaseItem>,
      setError: UseFormSetError<Record<string, string>>,
    ) => {
      try {
        await registerMutation.mutateAsync(values as unknown as NewUser);
      } catch (error) {
        handleFormError(error, setError);
      }
    },
    [registerMutation],
  );

  const roleOptions = getUserRoleOptions(t);

  const registerFields: FieldConfig[] = [
    {
      key: "email",
      label: t("users.register_form.email"),
      placeholder: t("users.register_form.email_placeholder"),
      required: true,
      inputType: "email",
    },
    {
      key: "name",
      label: t("users.register_form.name"),
      placeholder: t("users.register_form.name_placeholder"),
      required: true,
    },
    {
      key: "password",
      label: t("users.register_form.password"),
      placeholder: t("users.register_form.password_placeholder"),
      required: true,
      inputType: "password",
    },
    {
      key: "password_confirmation",
      label: t("users.register_form.password_confirmation"),
      placeholder: t("users.register_form.password_confirmation_placeholder"),
      required: true,
      inputType: "password",
    },
    {
      key: "role",
      label: t("users.register_form.role"),
      placeholder: t("users.register_form.role_placeholder"),
      required: true,
      type: "select",
      options: roleOptions,
    },
  ];

  return (
    <>
      <SmartTable
        titleKey="breadcrumbs.users"
        api={usersApi}
        queryKeyFn={queryKeys.users.list}
        searchPlaceholder="search_placeholders.users_name"
        columns={columns}
        headerActions={<AddButton onClick={() => setIsAddOpen(true)} />}
      />

      <DeleteConfirmDialog
        isOpen={targetUser !== null}
        onOpenChange={(open) => {
          if (!open) setTargetUser(null);
        }}
        title={isActive ? t("users.actions.block") : t("users.actions.unblock")}
        description={
          isActive
            ? t("users.actions.block_confirm", { name: targetUser?.name })
            : t("users.actions.unblock_confirm", { name: targetUser?.name })
        }
        cancelLabel={t("users.actions.cancel")}
        confirmLabel={
          isActive ? t("users.actions.block") : t("users.actions.unblock")
        }
        onConfirm={handleConfirm}
        isPending={statusMutation.isPending}
      />

      <ItemFormDialog
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        title={t("users.register_form.title")}
        fields={registerFields}
        schema={registerUserSchema}
        cancelLabel={t("users.register_form.cancel")}
        confirmLabel={t("users.register_form.submit")}
        onConfirm={handleRegisterSubmit}
        isPending={registerMutation.isPending}
      />
    </>
  );
};

export default UsersPage;
