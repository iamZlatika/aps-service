export const AuthRoutes = {
  root: () => "backoffice",
  auth: () => "auth",
  login: () => "login",
  forgotPassword: () => "forgot",
  backofficeForgotApi: () => `/backoffice/auth/forgot`,
  backofficeResetApi: () => "/backoffice/auth/reset",
  backofficeLoginApi: () => `/backoffice/auth/login`,
};
