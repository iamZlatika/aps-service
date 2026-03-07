import { LogOut } from "lucide-react";

import { useAuth } from "@/features/auth/useAuth";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";

export const BackofficeHeader = () => {
  const { user, logout } = useAuth();

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-white">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">
          Привет, {user?.name || "Пользователь"}
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
          title="Выйти"
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Выйти</span>
        </Button>
      </div>
    </header>
  );
};
