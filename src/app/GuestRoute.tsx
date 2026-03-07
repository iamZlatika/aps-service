import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/features/auth/useAuth.ts";
import { OrdersRoutes } from "@/features/backoffice/modules/orders/routers.ts";
import Loader from "@/shared/components/common/Loader.tsx";

export const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to={OrdersRoutes.linkToOrders()} replace />;
  }

  return <Outlet />;
};
