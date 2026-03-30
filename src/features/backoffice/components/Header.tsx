import { LogOut } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { memo, type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import SegmentedControl from "@/features/backoffice/components/SegmentedControl.tsx";
import { PROFILE_LINKS } from "@/features/backoffice/modules/profile/navigation.ts";
import { useUpdateLocale } from "@/features/backoffice/modules/users/hooks/useUpdateLocale.ts";
import { useUpdateTheme } from "@/features/backoffice/modules/users/hooks/useUpdateTheme.ts";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import {
  USER_LANGUAGES,
  type UserLanguage,
  type UserTheme,
} from "@/shared/types.ts";

export const Header = memo(() => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const updateLocale = useUpdateLocale();
  const updateTheme = useUpdateTheme();

  const [imgSrc, setImgSrc] = useState(user?.avatarUrl || "/default.webp");

  useEffect(() => {
    if (!user?.avatarUrl) return;
    let cancelled = false;
    const img = new Image();
    img.src = user?.avatarUrl;
    img.onload = () => {
      if (!cancelled) setImgSrc(user?.avatarUrl);
    };
    return () => {
      cancelled = true;
      img.onload = null;
      img.src = "";
    };
  }, [user?.avatarUrl]);

  const localeOptions: { label: string | ReactNode; value: UserLanguage }[] = [
    { label: "UK", value: USER_LANGUAGES.UK },
    { label: "RU", value: USER_LANGUAGES.RU },
  ];

  const themeOptions: { label: string | ReactNode; value: UserTheme }[] = [
    { label: <Sun size={16} />, value: "light" },
    { label: <Moon size={16} />, value: "dark" },
  ];
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-4">
        <SegmentedControl
          onChange={updateLocale.mutate}
          disabled={updateLocale.isPending}
          value={user?.locale || "uk"}
          options={localeOptions}
        />
        <SegmentedControl
          onChange={updateTheme.mutate}
          disabled={updateTheme.isPending}
          value={user?.theme || "dark"}
          options={themeOptions}
        />

        <Link to={PROFILE_LINKS.root()} className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {user?.name || t("header.user")}
          </span>

          <Avatar>
            <AvatarImage src={imgSrc} alt={user?.name || "User avatar"} />
          </Avatar>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => logout()}
          title={t("header.logout")}
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">{t("header.logout")}</span>
        </Button>
      </div>
    </header>
  );
});
