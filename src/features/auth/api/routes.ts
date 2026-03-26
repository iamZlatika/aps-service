export const AuthRoutes = {
  //router
  backofficeRoot: () => "/backoffice",
  auth: () => "auth",
  login: () => "login",
  forgotPassword: () => "forgot",
  emailSent: () => "email-sent",
  resetPassword: () => "reset-password",

  // navigate
  linkToForgot: () => "/backoffice/auth/forgot",
  linkToEmailSent: () => "/backoffice/auth/email-sent",
  linkToLogin: () => "/backoffice/auth/login",
  // api
  backofficeForgotApi: () => "/backoffice/auth/forgot-password",
  backofficeLoginApi: () => "/backoffice/auth/login",
  backofficeResetCheckTokenApi: () => "/backoffice/auth/check-token",
  backofficeResetPasswordApi: () => "/backoffice/auth/reset-password",
  backofficeChangePasswordApi: () => "/backoffice/auth/change-password",
};
