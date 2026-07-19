export const AuthRoutes = {
  //router
  backofficeRoot: () => "/",
  auth: () => "auth",
  login: () => "login",
  forgotPassword: () => "forgot",
  emailSent: () => "email-sent",
  resetPassword: () => "reset-password",

  // navigate
  linkToForgot: () => "/auth/forgot",
  linkToEmailSent: () => "/auth/email-sent",
  linkToLogin: () => "/auth/login",
  // api
  backofficeForgotApi: () => "/backoffice/auth/forgot-password",
  backofficeLoginApi: () => "/backoffice/auth/login",
  backofficeLogoutApi: () => "/backoffice/auth/logout",
  backofficeResetCheckTokenApi: () => "/backoffice/auth/check-token",
  backofficeResetPasswordApi: () => "/backoffice/auth/reset-password",
};
