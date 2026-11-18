import { Navigate, Outlet } from "react-router-dom";

import { type Ability } from "@/features/auth/abilities.ts";
import { AuthRoutes } from "@/features/auth/api/routes.ts";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { SharedRoutes } from "@/shared/api/routes.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";

interface ProtectedRouteProps {
  requiredAbility?: Ability;
}

export const ProtectedRoute = ({ requiredAbility }: ProtectedRouteProps) => {
  const { isAuthenticated, can, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={AuthRoutes.linkToLogin()} replace />;
  }

  if (requiredAbility && !can(requiredAbility)) {
    return <Navigate to={SharedRoutes.forbidden()} replace />;
  }

  return <Outlet />;
};
