import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { AddButton } from "@/features/backoffice/components/AddButton";
import { usersApi } from "@/features/backoffice/modules/users/api";
import { UserLocationSelect } from "@/features/backoffice/modules/users/components/UserLocationSelect.tsx";
import { getUserRoleOptions } from "@/features/backoffice/modules/users/data.ts";
import { useRegisterUser } from "@/features/backoffice/modules/users/hooks/useRegisterUser.ts";
import { useUpdateUserStatus } from "@/features/backoffice/modules/users/hooks/useUpdateUserStatus.ts";
import { registerUserSchema } from "@/features/backoffice/modules/users/lib/registerUserSchema.ts";
import { USERS_LINKS } from "@/features/backoffice/modules/users/navigation";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import { SmartTable } from "@/features/backoffice/widgets/table";
import {
  DeleteConfirmDialog,
  ItemFormDialog,
} from "@/features/backoffice/widgets/table/components/dialogs";
import type {
  ColumnConfig,
  FieldConfig,
} from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { UserStatusButton } from "@/shared/components/common/UserStatusButton.tsx";
import { USER_STATUSES, type UserStatus } from "@/shared/types.ts";

const UsersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns: ColumnConfig<User>[] = [
    {
      key: "name",
      field: "name",
      labelKey: "users.table_fields.name",
      sortable: false,
    },
    {
      key: "roles",
      field: "roles",
      labelKey: "users.table_fields.role",
      sortable: false,
      renderCell: (value) =>
        (value as string[])
          .map((r) => t(`users.roles.${r}`, { defaultValue: r }))
          .join(", "),
    },
    {
      key: "location",
      field: "location",
      labelKey: "users.table_fields.location",
      sortable: false,
      renderCell: (_, item) => (
        <div onClick={(e) => e.stopPropagation()}>
          <UserLocationSelect user={item} />
        </div>
      ),
    },
    {
      key: "status",
      field: "status",
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
  const isActive = targetUser?.status === USER_STATUSES.ACTIVE;
  const newStatus: UserStatus = isActive
    ? USER_STATUSES.BLOCKED
    : USER_STATUSES.ACTIVE;

  const { updateStatus, isPending: isStatusPending } = useUpdateUserStatus(() =>
    setTargetUser(null),
  );

  const handleStatusClick = useCallback((item: User) => {
    setTargetUser(item);
  }, []);

  const handleConfirm = useCallback(() => {
    if (targetUser) {
      updateStatus(targetUser.id, newStatus);
    }
  }, [targetUser, newStatus, updateStatus]);

  const [isAddOpen, setIsAddOpen] = useState(false);

  const { onSubmit: handleRegisterSubmit, isPending: isRegisterPending } =
    useRegisterUser(() => setIsAddOpen(false));

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
      key: "roles",
      label: t("users.register_form.role"),
      placeholder: t("users.register_form.role_placeholder"),
      required: true,
      type: "select",
      options: getUserRoleOptions(t),
    },
  ];

  const onRowClick = (user: User) => {
    navigate(USERS_LINKS.detail(user.id));
  };

  return (
    <>
      <SmartTable
        titleKey="breadcrumbs.users"
        api={usersApi}
        queryKeyFn={queryKeys.users.list}
        searchPlaceholder="search_placeholders.users_name"
        columns={columns}
        headerActions={<AddButton onClick={() => setIsAddOpen(true)} />}
        onRowClick={onRowClick}
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
        isPending={isStatusPending}
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
        isPending={isRegisterPending}
      />
    </>
  );
};

export default UsersPage;
