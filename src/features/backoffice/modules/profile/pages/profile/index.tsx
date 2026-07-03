import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import UserAvatar from "@/features/backoffice/modules/profile/components/avatar/components/UserAvatar.tsx";
import ChangePasswordForm from "@/features/backoffice/modules/profile/components/ChangePasswordForm.tsx";
import ChangeUserInfoForm from "@/features/backoffice/modules/profile/components/ChangeUserInfoForm.tsx";
import { CHANGE_USER_INFO_FORM_ID } from "@/features/backoffice/modules/profile/components/constants.ts";
import { MyBalanceCard } from "@/features/backoffice/modules/profile/components/MyBalanceCard.tsx";
import { ProfileTabs } from "@/features/backoffice/modules/profile/components/ProfileTabs.tsx";
import { RoleBadge } from "@/features/backoffice/modules/profile/components/RoleBadge.tsx";
import { UserAbilitiesSection } from "@/features/backoffice/modules/profile/components/UserAbilitiesSection.tsx";
import { usePermissions } from "@/features/backoffice/modules/roles-permissions/hooks/usePermissions.ts";
import { PersonCard } from "@/features/backoffice/widgets/person-card/PersonCard.tsx";
import { AcceptButton } from "@/shared/components/common/buttons/AcceptButton.tsx";
import { CancelButton } from "@/shared/components/common/buttons/CancelButton.tsx";
import { Loader } from "@/shared/components/common/Loader.tsx";
import { CardTitle } from "@/shared/components/ui/card.tsx";
import { groupPermissionsByCategory } from "@/widgets/ability-badge/abilityGroups";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { permissions } = usePermissions();
  const abilityGroups = groupPermissionsByCategory(permissions);
  const [imageReady, setImageReady] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
        <CardTitle className="text-xl font-bold mb-4 text-center">
          {t("profile.change_form.change_password")}
        </CardTitle>
        <ChangePasswordForm />
      </PersonCard>
    </div>
  );
};

export default ProfilePage;
