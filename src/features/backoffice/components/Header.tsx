import { LogOut } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { useLanguage } from "@/shared/lib/i18n/useLanguage.ts";

export const Header = memo(() => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-white">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-4">
        {/* Language switcher group */}
        <div className="flex items-center border rounded-md overflow-hidden">
          <Button
            variant={currentLanguage === "uk" ? "default" : "ghost"}
            size="sm"
            className="rounded-none h-8 px-3"
            onClick={() => changeLanguage("uk")}
          >
            UK
          </Button>
          <div className="w-[1px] h-4 bg-border" />
          <Button
            variant={currentLanguage === "ru" ? "default" : "ghost"}
            size="sm"
            className="rounded-none h-8 px-3"
            onClick={() => changeLanguage("ru")}
          >
            RU
          </Button>
        </div>

        <span className="text-sm font-medium">
          {t("header.welcome", { name: user?.name || t("header.user") })}
        </span>

        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {firstLetter}
          </AvatarFallback>
        </Avatar>

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
