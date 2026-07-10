import { useSyncExternalStore } from "react";

import { customerAuthService } from "@/features/auth/lib/authService";

type UseCustomerAuthReturn = {
  isAuthenticated: boolean;
};

const getIsAuthenticated = (): boolean => !!customerAuthService.getToken();

export const useCustomerAuth = (): UseCustomerAuthReturn => {
  const isAuthenticated = useSyncExternalStore(
    customerAuthService.subscribe,
    getIsAuthenticated,
  );

  return { isAuthenticated };
};
