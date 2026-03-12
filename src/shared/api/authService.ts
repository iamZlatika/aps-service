import Cookies from "js-cookie";

export const authService = {
  getToken: (): string | undefined => Cookies.get("auth_token"),
  setToken: (token: string, expiresDays = 365) =>
    Cookies.set("auth_token", token, {
      expires: expiresDays,
      secure: true,
      sameSite: "strict",
    }),
  clearToken: () => Cookies.remove("auth_token"),
};
