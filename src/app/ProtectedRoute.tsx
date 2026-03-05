import { Navigate, Outlet } from "react-router-dom";

import { AuthRoutes } from "@/features/auth/routes.ts";
import { useAuth } from "@/features/auth/useAuth.ts";
import { SharedRoutes } from "@/shared/api/routes.ts";

import type { Role } from "../types/types.ts";

type ProtectedRouteProps = {
  allowedRoles?: Role[];
};

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={AuthRoutes.linkToLogin()} replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={SharedRoutes.forbidden()} replace />;
  }

  return <Outlet />;
};
