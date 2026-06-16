import { Navigate, Outlet } from "react-router-dom";

import { useCustomerAuth } from "@/features/auth/website/hooks/useCustomerAuth";
import {
  LOGIN_MODAL_VALUE,
  MODAL_PARAM,
} from "@/features/website/lib/modalParams";
import { WEBSITE_LINKS } from "@/features/website/navigation";

export const CustomerProtectedRoute = () => {
  const { isAuthenticated } = useCustomerAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`${WEBSITE_LINKS.home}?${MODAL_PARAM}=${LOGIN_MODAL_VALUE}`}
        replace
      />
    );
  }

  return <Outlet />;
};
