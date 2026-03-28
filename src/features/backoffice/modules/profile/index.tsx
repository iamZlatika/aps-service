import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import UserAvatar from "@/features/backoffice/modules/profile/components/avatar/components/UserAvatar.tsx";
import ChangePasswordForm from "@/features/backoffice/modules/profile/components/ChangePasswordForm.tsx";
import ChangeUserInfoForm from "@/features/backoffice/modules/profile/components/ChangeUserInfoForm.tsx";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card.tsx";
import { Separator } from "@/shared/components/ui/separator.tsx";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) return null;

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
            <ChangeUserInfoForm userName={user.name} userEmail={user.email} />
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
