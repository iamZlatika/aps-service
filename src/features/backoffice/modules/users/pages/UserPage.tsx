import { Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { RoleBadge } from "@/features/backoffice/modules/profile/components/RoleBadge.tsx";
import { usePermissions } from "@/features/backoffice/modules/roles-permissions/hooks/usePermissions.ts";
import { useRoles } from "@/features/backoffice/modules/roles-permissions/hooks/useRoles.ts";
import { UserLocationSection } from "@/features/backoffice/modules/users/components/UserLocationSection.tsx";
import { UserRateSection } from "@/features/backoffice/modules/users/components/UserRateSection.tsx";
import { UserRolesPermissionsSection } from "@/features/backoffice/modules/users/components/UserRolesPermissionsSection.tsx";
import { useUpdateUserStatus } from "@/features/backoffice/modules/users/hooks/useUpdateUserStatus.ts";
import { useUser } from "@/features/backoffice/modules/users/hooks/useUser.ts";
import { PersonCard } from "@/features/backoffice/widgets/person-card/PersonCard.tsx";
import { DeleteConfirmDialog } from "@/features/backoffice/widgets/table/components/dialogs";
import { Loader } from "@/shared/components/common/Loader.tsx";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { CardTitle } from "@/shared/components/ui/card.tsx";
import { Separator } from "@/shared/components/ui/separator.tsx";
import { USER_STATUSES, type UserStatus } from "@/shared/types.ts";
import { groupPermissionsByCategory } from "@/widgets/ability-badge/abilityGroups";

const UserPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id, 10) : null;

  const { can } = useAuth();
  const canManageRoles = can("users_roles_permissions_manage");
  const canManageUsers = can("users_manage");

  const { user, isLoading } = useUser(userId);
  const { roles: rolesData } = useRoles(canManageRoles);
  const { permissions } = usePermissions(canManageRoles);
  const abilityGroups = groupPermissionsByCategory(permissions);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isActive = user?.status === USER_STATUSES.ACTIVE;
  const newStatus: UserStatus = isActive
    ? USER_STATUSES.BLOCKED
    : USER_STATUSES.ACTIVE;

  const { updateStatus, isPending: isStatusPending } = useUpdateUserStatus(() =>
    setIsConfirmOpen(false),
  );

  if (isLoading) return <Loader />;
  if (!user) return null;

  const statusIcon = isActive ? (
    <Unlock className="h-4 w-4" />
  ) : (
    <Lock className="h-4 w-4" />
  );

  const leftAction = canManageUsers ? (
    <button
      type="button"
      onClick={() => setIsConfirmOpen(true)}
      className={
        isActive
          ? "p-2 text-green-600 hover:text-green-700 transition-colors"
          : "p-2 text-red-600 hover:text-red-700 transition-colors"
      }
    >
      {statusIcon}
    </button>
  ) : (
    <span className={isActive ? "p-2 text-green-600" : "p-2 text-red-600"}>
      {statusIcon}
    </span>
  );

  return (
    <>
      <div className="p-2 sm:p-6 max-w-5xl mx-auto w-full">
        <PersonCard
          avatarSlot={
            <Avatar className="h-[100px] w-[100px] sm:h-[150px] sm:w-[150px]">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
            </Avatar>
          }
          infoSlot={
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold truncate">
                {user.name}
              </span>
              <span className="text-xl text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
          }
          metaSlot={<RoleBadge roles={user.roles} />}
          leftAction={leftAction}
        >
          <UserRateSection user={user} canManage={canManageUsers} />
          <Separator className="my-4 h-px bg-border" />
          <UserLocationSection user={user} canManage={canManageUsers} />
          {canManageRoles && (
            <>
              <Separator className="my-4 h-px bg-border" />
              <CardTitle className="text-xl font-bold mb-4 text-center">
                {t("users.roles_permissions.title")}
              </CardTitle>
              <UserRolesPermissionsSection
                userId={user.id}
                initialRoles={user.roles}
                initialPermissions={user.permissions}
                rolesData={rolesData}
                abilityGroups={abilityGroups}
              />
            </>
          )}
        </PersonCard>
      </div>

      <DeleteConfirmDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={isActive ? t("users.actions.block") : t("users.actions.unblock")}
        description={
          isActive
            ? t("users.actions.block_confirm", { name: user.name })
            : t("users.actions.unblock_confirm", { name: user.name })
        }
        cancelLabel={t("users.actions.cancel")}
        confirmLabel={
          isActive ? t("users.actions.block") : t("users.actions.unblock")
        }
        onConfirm={() => updateStatus(user.id, newStatus)}
        isPending={isStatusPending}
      />
    </>
  );
};

export default UserPage;
