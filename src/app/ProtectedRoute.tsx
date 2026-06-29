import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthRoutes } from "@/features/auth/backoffice/api/routes.ts";
import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { SharedRoutes } from "@/shared/api/routes.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";
import { destroyEcho } from "@/shared/lib/echo.ts";

type ProtectedRouteProps = {
  requiredAbility?: string;
};

export const ProtectedRoute = ({ requiredAbility }: ProtectedRouteProps) => {
  const { isAuthenticated, can, isLoading } = useAuth();

  // Disconnects the socket when leaving the backoffice area entirely (e.g. to the
  // public website), even if the auth token stays valid. Lives here because this
  // component mounts/unmounts exactly once per backoffice session, unlike useAuth
  // which is called by many components and would otherwise tear down the shared
  // connection on every one of their re-renders.
  useEffect(() => {
    return () => destroyEcho();
  }, []);

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
