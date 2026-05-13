import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import UserAvatar from "@/features/backoffice/modules/profile/components/avatar/components/UserAvatar.tsx";
import ChangePasswordForm from "@/features/backoffice/modules/profile/components/ChangePasswordForm.tsx";
import ChangeUserInfoForm from "@/features/backoffice/modules/profile/components/ChangeUserInfoForm.tsx";
import { CHANGE_USER_INFO_FORM_ID } from "@/features/backoffice/modules/profile/components/constants.ts";
import { RoleBadge } from "@/features/backoffice/modules/profile/components/RoleBadge.tsx";
import { PersonCard } from "@/features/backoffice/widgets/person-card/PersonCard.tsx";
import { AcceptButton } from "@/shared/components/common/buttons/AcceptButton.tsx";
import { CancelButton } from "@/shared/components/common/buttons/CancelButton.tsx";
import Loader from "@/shared/components/common/Loader.tsx";
import { CardTitle } from "@/shared/components/ui/card.tsx";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
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
      onClick={() => setIsEditing(true)}
      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
    >
      <Pencil className="h-4 w-4" />
    </button>
  );

  return (
    <div className="p-2 sm:p-6 max-w-3xl mx-auto w-full">
      <h1 className="mb-6 text-2xl font-bold">{t("profile.settings")}</h1>
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
        metaSlot={<RoleBadge role={user.role} />}
        rightAction={rightAction}
      >
        <CardTitle className="text-xl font-bold mb-4 text-center">
          {t("profile.your_balance")}
        </CardTitle>
        <div className="h-11 rounded-md border border-input bg-muted px-3 text-base flex items-center justify-center mb-6">
          {new Intl.NumberFormat("uk-UA", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(parseFloat(user.balance))}{" "}
          ₴
        </div>
        <CardTitle className="text-xl font-bold mb-4 text-center">
          {t("profile.your_rate")}
        </CardTitle>
        <div className="grid grid-cols-3 divide-x divide-border mb-6">
          <div className="pr-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              {t("profile.services_percent")}
            </p>
            <p className="text-lg font-semibold">{user.servicesPercent}%</p>
          </div>
          <div className="px-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              {t("profile.products_percent")}
            </p>
            <p className="text-lg font-semibold">{user.productsPercent}%</p>
          </div>
          <div className="pl-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              {t("profile.intake_percent")}
            </p>
            <p className="text-lg font-semibold">{user.intakePercent}%</p>
          </div>
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
