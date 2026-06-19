import Cookies from "js-cookie";

export type AuthScope = "backoffice" | "customer";

const COOKIE_NAMES: Record<AuthScope, string> = {
  backoffice: "backoffice_auth_token",
  customer: "customer_auth_token",
};

export type AuthService = {
  getToken: () => string | undefined;
  setToken: (token: string, expiresDays?: number) => void;
  clearToken: () => void;
};

const createAuthService = (scope: AuthScope): AuthService => {
  const cookieName = COOKIE_NAMES[scope];

  return {
    getToken: (): string | undefined => Cookies.get(cookieName),
    setToken: (token: string, expiresDays = 365) =>
      Cookies.set(cookieName, token, {
        expires: expiresDays,
        secure: true,
        sameSite: "strict",
      }),
    clearToken: () => Cookies.remove(cookieName),
  };
};

export const backofficeAuthService = createAuthService("backoffice");
export const customerAuthService = createAuthService("customer");
