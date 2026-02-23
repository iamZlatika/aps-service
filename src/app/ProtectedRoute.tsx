import { Navigate, Outlet } from "react-router-dom";

import type { Role } from "../types/types.ts";

// 🔧 временная заглушка.
// потом заменишь на Zustand/Context/Redux
const useAuth = () => {
  return {
    isAuthenticated: true,
    role: "user" as Role,
  };
};

type ProtectedRouteProps = {
  allowedRoles?: Role[];
};

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};
