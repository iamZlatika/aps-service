import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import UserAvatar from "@/features/profile/components/avatar/components/UserAvatar.tsx";
import ChangePasswordModal from "@/features/profile/components/ChangePasswordModal.tsx";
import ChangeUserInfoForm from "@/features/profile/components/ChangeUserInfoForm.tsx";
import { CHANGE_USER_INFO_FORM_ID } from "@/features/profile/components/constants.ts";
import { MyBalanceCard } from "@/features/profile/components/MyBalanceCard.tsx";
import { ProfileTabs } from "@/features/profile/components/ProfileTabs.tsx";
import { RoleBadge } from "@/features/profile/components/RoleBadge.tsx";
import { UserAbilitiesSection } from "@/features/profile/components/UserAbilitiesSection.tsx";
import { usePermissions } from "@/features/roles-permissions/hooks/usePermissions.ts";
import { AcceptButton } from "@/shared/components/common/buttons/AcceptButton.tsx";
import { CancelButton } from "@/shared/components/common/buttons/CancelButton.tsx";
import { Loader } from "@/shared/components/common/Loader.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { CardTitle } from "@/shared/components/ui/card.tsx";
import { Separator } from "@/shared/components/ui/separator.tsx";
import { groupPermissionsByCategory } from "@/widgets/ability-badge/abilityGroups";
import { PersonCard } from "@/widgets/person-card/PersonCard.tsx";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { permissions } = usePermissions();
  const abilityGroups = groupPermissionsByCategory(permissions);
  const [imageReady, setImageReady] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    const avatarUrl = user?.avatarUrl;
    if (!avatarUrl) {
      setImageReady(true);
      return;
    }
    const img = new Image();
    img.onload = () => setImageReady(true);
    img.onerror = () => setImageReady(true);
    img.src = avatarUrl;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [user?.avatarUrl]);

  if (!user || !imageReady) return <Loader />;

  const rightAction = isEditing ? (
    <>
      <AcceptButton type="submit" form={CHANGE_USER_INFO_FORM_ID} />
      <CancelButton onClick={() => setIsEditing(false)} />
    </>
  ) : (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
    >
      <Pencil className="h-4 w-4" />
    </button>
  );

  return (
    <div className="p-2 sm:p-6 max-w-5xl mx-auto w-full">
      <h1 className="mb-6 text-2xl font-bold">{t("profile.settings")}</h1>
      <ProfileTabs />
      <MyBalanceCard balance={user.balance} />
      <PersonCard
        avatarSlot={
          <UserAvatar
            userName={user.name}
            userAvatarUrl={user.avatarUrl || ""}
          />
        }
        infoSlot={
          <ChangeUserInfoForm
            userName={user.name}
            userEmail={user.email}
            isEditing={isEditing}
            onSubmitSuccess={() => setIsEditing(false)}
          />
        }
        metaSlot={<RoleBadge roles={user.roles} />}
        rightAction={rightAction}
      >
        <CardTitle className="text-xl font-bold mb-4 text-center">
          {t("profile.your_abilities")}
        </CardTitle>
        <div className="mb-6">
          <UserAbilitiesSection
            abilities={user.abilities}
            abilityGroups={abilityGroups}
          />
        </div>
        <Separator className="my-6 h-px bg-border" />
        <CardTitle className="text-xl font-bold mb-4 text-center">
          {t("profile.security_title")}
        </CardTitle>
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            {t("profile.change_form.change_password")}
          </Button>
        </div>
      </PersonCard>
      <ChangePasswordModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
