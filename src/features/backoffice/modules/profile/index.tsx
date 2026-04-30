import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import UserAvatar from "@/features/backoffice/modules/profile/components/avatar/components/UserAvatar.tsx";
import ChangePasswordForm from "@/features/backoffice/modules/profile/components/ChangePasswordForm.tsx";
import ChangeUserInfoForm from "@/features/backoffice/modules/profile/components/ChangeUserInfoForm.tsx";
import { RoleBadge } from "@/features/backoffice/modules/profile/components/RoleBadge.tsx";
import Loader from "@/shared/components/common/Loader.tsx";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card.tsx";
import { Separator } from "@/shared/components/ui/separator.tsx";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [imageReady, setImageReady] = useState(false);

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

  return (
    <div className="p-2 sm:p-6 max-w-3xl mx-auto w-full">
      <h1 className="mb-6 text-2xl font-bold">{t("profile.settings")}</h1>
      <Card className="p-2 sm:p-6">
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <UserAvatar
              userName={user.name}
              userAvatarUrl={user.avatarUrl || ""}
            />
            <div>
              <ChangeUserInfoForm userName={user.name} userEmail={user.email} />
              <RoleBadge role={user.role} />
            </div>
          </div>

          <Separator className="my-6 h-px bg-border" />
          <CardTitle className="text-2xl font-bold my-4">
            {t("profile.change_form.change_password")}
          </CardTitle>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
