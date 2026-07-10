import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation";
import { Loader } from "@/shared/components/common/Loader.tsx";

interface GuestRouteProps {
  // The login page owns its own busy/loading UI (freezes the form and shows
  // one continuous loader through both the login request and the profile
  // fetch), so it opts out to avoid a second, competing full-page loader.
  showLoader?: boolean;
}

export const GuestRoute = ({ showLoader = true }: GuestRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return showLoader ? <Loader /> : <Outlet />;
  }

  if (isAuthenticated) {
    return <Navigate to={ORDERS_LINKS.root()} replace />;
  }

  return <Outlet />;
};
