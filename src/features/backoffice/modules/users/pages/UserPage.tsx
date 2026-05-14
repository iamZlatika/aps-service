import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { RoleBadge } from "@/features/backoffice/modules/profile/components/RoleBadge.tsx";
import { usersApi } from "@/features/backoffice/modules/users/api";
import { UserLocationSection } from "@/features/backoffice/modules/users/components/UserLocationSection.tsx";
import { UserRateSection } from "@/features/backoffice/modules/users/components/UserRateSection.tsx";
import { useUser } from "@/features/backoffice/modules/users/hooks/useUser.ts";
import { PersonCard } from "@/features/backoffice/widgets/person-card/PersonCard.tsx";
import { DeleteConfirmDialog } from "@/features/backoffice/widgets/table/components/dialogs";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import Loader from "@/shared/components/common/Loader.tsx";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { Separator } from "@/shared/components/ui/separator.tsx";
import { type UserStatus } from "@/shared/types.ts";

const UserPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id, 10) : null;
  const queryClient = useQueryClient();

  const { user, isLoading } = useUser(userId);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isActive = user?.status === "active";
  const newStatus: UserStatus = isActive ? "blocked" : "active";

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: UserStatus }) =>
      usersApi.updateUserStatus(id, status),
    onSuccess: () => {
      setIsConfirmOpen(false);
      return queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      });
    },
  });

  if (isLoading) return <Loader />;
  if (!user) return null;

  const leftAction = (
    <button
      type="button"
      onClick={() => setIsConfirmOpen(true)}
      className={
        isActive
          ? "p-2 text-green-600 hover:text-green-700 transition-colors"
          : "p-2 text-red-600 hover:text-red-700 transition-colors"
      }
    >
      {isActive ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
    </button>
  );

  return (
    <>
      <div className="p-2 sm:p-6 max-w-3xl mx-auto w-full">
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
          metaSlot={<RoleBadge role={user.role} />}
          leftAction={leftAction}
        >
          <UserRateSection user={user} />
          <Separator className="my-4 h-px bg-border" />
          <UserLocationSection user={user} />
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
        onConfirm={() =>
          statusMutation.mutate({ id: user.id, status: newStatus })
        }
        isPending={statusMutation.isPending}
      />
    </>
  );
};

export default UserPage;
