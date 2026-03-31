import { Lock, Unlock, UserCheck, UserLock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button.tsx";
import { useIsMobile } from "@/shared/hooks/useMobile.ts";

interface UserStatusButtonProps {
  status: string;
  onClick: () => void;
}

export const UserStatusButton = ({
  status,
  onClick,
}: UserStatusButtonProps) => {
  const { t } = useTranslation();
  const isActive = status === "active";
  const isMobile = useIsMobile();

  return (
    <Button
      size="sm"
      variant="ghost"
      className={
        isActive
          ? "text-red-600 hover:text-red-700 hover:bg-red-50"
          : "text-green-600 hover:text-green-700 hover:bg-green-50"
      }
      onClick={onClick}
    >
      {isMobile ? (
        isActive ? (
          <>
            <UserLock className="mr-1 h-4 w-4" />
          </>
        ) : (
          <>
            <UserCheck className="mr-1 h-4 w-4" />
          </>
        )
      ) : isActive ? (
        <>
          <Lock className="mr-1 h-4 w-4" />
          {t("users.actions.block")}
        </>
      ) : (
        <>
          <Unlock className="mr-1 h-4 w-4" />
          {t("users.actions.unblock")}
        </>
      )}
    </Button>
  );
};
