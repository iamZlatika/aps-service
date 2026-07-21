export const AuthRoutes = {
  //router
  root: () => "/",
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
  forgotPasswordApi: () => "/backoffice/auth/forgot-password",
  loginApi: () => "/backoffice/auth/login",
  logoutApi: () => "/backoffice/auth/logout",
  resetCheckTokenApi: () => "/backoffice/auth/check-token",
  resetPasswordApi: () => "/backoffice/auth/reset-password",
};
