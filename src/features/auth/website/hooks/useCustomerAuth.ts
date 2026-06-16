import { authService } from "@/features/auth/lib/authService";
import { type Customer } from "@/features/auth/website/types";

type UseCustomerAuthReturn = {
  customer: Customer | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export const useCustomerAuth = (): UseCustomerAuthReturn => {
  const token = authService.getToken();

  return {
    customer: undefined,
    isAuthenticated: !!token,
    isLoading: false,
  };
};
