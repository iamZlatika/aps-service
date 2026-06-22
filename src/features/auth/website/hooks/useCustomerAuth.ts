import { customerAuthService } from "@/features/auth/lib/authService";

type UseCustomerAuthReturn = {
  isAuthenticated: boolean;
};

export const useCustomerAuth = (): UseCustomerAuthReturn => {
  return { isAuthenticated: !!customerAuthService.getToken() };
};
