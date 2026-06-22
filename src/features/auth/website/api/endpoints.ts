const BASE = "/api/auth";

export const WEBSITE_AUTH_API = {
  register: () => `${BASE}/register`,
  login: () => `${BASE}/login`,
  emailResend: () => `${BASE}/email/resend`,
  me: () => "/api/me",
  logout: () => `${BASE}/logout`,
  phoneSend: () => `${BASE}/phone/send`,
  phoneVerify: () => `${BASE}/phone/verify`,
  passwordForgot: () => `${BASE}/password/forgot`,
  passwordCheckToken: () => `${BASE}/password/check-token`,
  passwordReset: () => `${BASE}/password/reset`,
} as const;
