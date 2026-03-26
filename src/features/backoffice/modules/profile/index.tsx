import { Separator } from "@radix-ui/react-select";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import ChangePasswordForm from "@/features/backoffice/modules/profile/components/ChangePasswordForm.tsx";
import UserAvatar from "@/features/backoffice/modules/profile/components/UserAvatar.tsx";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card.tsx";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="p-2 sm:p-6 max-w-3xl mx-auto w-full">
      <h1 className="mb-6 text-2xl font-bold">{t("profile.settings")}</h1>
      <Card className="p-2 sm:p-6 max-w-3xl mx-auto w-full">
        <CardContent>
          <div className="flex items-center gap-6">
            <UserAvatar
              userName={user?.name || ""}
              userAvatarUrl={user?.avatarUrl || ""}
            />
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-semibold">{user?.name}</span>
              <span className="text-xl text-muted-foreground">
                {user?.email}
              </span>
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
