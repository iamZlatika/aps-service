import { Navigate, Outlet } from "react-router-dom";

import { AuthRoutes } from "@/features/auth/backoffice/api/routes.ts";
import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { SharedRoutes } from "@/shared/api/routes.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";
import type { Role } from "@/shared/types.ts";

type ProtectedRouteProps = {
  allowedRoles?: Role[];
};

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={AuthRoutes.linkToLogin()} replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={SharedRoutes.forbidden()} replace />;
  }

  return <Outlet />;
};
