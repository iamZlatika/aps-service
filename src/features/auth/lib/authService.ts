import Cookies from "js-cookie";

const COOKIE_NAME = "backoffice_auth_token";

export type AuthService = {
  getToken: () => string | undefined;
  setToken: (token: string, expiresDays?: number) => void;
  clearToken: () => void;
  subscribe: (listener: () => void) => () => void;
};

const createAuthService = (): AuthService => {
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());

  return {
    getToken: (): string | undefined => Cookies.get(COOKIE_NAME),
    setToken: (token: string, expiresDays = 365) => {
      Cookies.set(COOKIE_NAME, token, {
        expires: expiresDays,
        secure: true,
        sameSite: "strict",
      });
      notify();
    },
    clearToken: () => {
      Cookies.remove(COOKIE_NAME);
      notify();
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export const authService = createAuthService();
