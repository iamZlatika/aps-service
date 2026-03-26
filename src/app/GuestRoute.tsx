import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { ORDERS_LINKS } from "@/features/backoffice/modules/orders/navigation";
import Loader from "@/shared/components/common/Loader.tsx";

export const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to={ORDERS_LINKS.root()} replace />;
  }

  return <Outlet />;
};
