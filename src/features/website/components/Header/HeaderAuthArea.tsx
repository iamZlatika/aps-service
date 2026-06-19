import { Suspense } from "react";

import { useCustomerAuth } from "@/features/auth/website/hooks/useCustomerAuth";
import { useLogout } from "@/features/auth/website/hooks/useLogout";
import { HeaderCabinetButton } from "@/features/website/components/Header/HeaderCabinetButton";
import { HeaderUserBadge } from "@/features/website/components/Header/HeaderUserBadge";
import { WEBSITE_LINKS } from "@/features/website/navigation";

interface HeaderAuthAreaProps {
  buttonClassName?: string;
  showUserName?: boolean;
}

interface HeaderLoggedInAreaProps {
  showUserName?: boolean;
}

const HeaderLoggedInArea = ({ showUserName }: HeaderLoggedInAreaProps) => {
  const { logout, isLoggingOut } = useLogout(WEBSITE_LINKS.home);

  return (
    <Suspense
      fallback={
        <div
          className="size-[42px] animate-pulse rounded-full bg-ws-line"
          aria-hidden="true"
        />
      }
    >
      <HeaderUserBadge
        logout={logout}
        isLoggingOut={isLoggingOut}
        showUserName={showUserName}
      />
    </Suspense>
  );
};

export const HeaderAuthArea = ({
  buttonClassName,
  showUserName,
}: HeaderAuthAreaProps) => {
  const { isAuthenticated } = useCustomerAuth();

  if (!isAuthenticated) {
    return <HeaderCabinetButton className={buttonClassName} />;
  }

  return <HeaderLoggedInArea showUserName={showUserName} />;
};
