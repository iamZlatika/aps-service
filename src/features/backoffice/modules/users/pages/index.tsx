import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { AddButton } from "@/features/backoffice/components/AddButton";
import { usersApi } from "@/features/backoffice/modules/users/api";
import { RegisterUserDialog } from "@/features/backoffice/modules/users/components/RegisterUserDialog.tsx";
import { UserLocationSelect } from "@/features/backoffice/modules/users/components/UserLocationSelect.tsx";
import { useRegisterUser } from "@/features/backoffice/modules/users/hooks/useRegisterUser.ts";
import { useUpdateUserStatus } from "@/features/backoffice/modules/users/hooks/useUpdateUserStatus.ts";
import { USERS_LINKS } from "@/features/backoffice/modules/users/navigation";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { DeleteConfirmDialog } from "@/features/backoffice/widgets/table/components/dialogs";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { UserStatusButton } from "@/shared/components/common/UserStatusButton.tsx";
import { USER_STATUSES, type UserStatus } from "@/shared/types.ts";

const UsersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { can } = useAuth();
  const canManageUsers = can("users_manage");

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
      renderCell: (_, item) =>
        canManageUsers ? (
          <div onClick={(e) => e.stopPropagation()}>
            <UserLocationSelect user={item} />
          </div>
        ) : (
          <span>{item.location?.name ?? "—"}</span>
        ),
    },
    {
      key: "status",
      field: "status",
      labelKey: "users.table_fields.status",
      sortable: true,
      className: "text-right [&>*]:ml-auto [&>div]:justify-end",
      renderCell: (value, item) =>
        canManageUsers ? (
          <div onClick={(e) => e.stopPropagation()}>
            <UserStatusButton
              status={String(value)}
              onClick={() => handleStatusClick(item)}
            />
          </div>
        ) : (
          <UserStatusButton
            status={String(value)}
            onClick={() => handleStatusClick(item)}
            disabled
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
        headerActions={
          canManageUsers && <AddButton onClick={() => setIsAddOpen(true)} />
        }
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

      <RegisterUserDialog
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        onConfirm={handleRegisterSubmit}
        isPending={isRegisterPending}
      />
    </>
  );
};

export default UsersPage;
