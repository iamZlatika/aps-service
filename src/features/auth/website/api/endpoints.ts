const BASE = "/api/auth";

export const WEBSITE_AUTH_API = {
  register: () => `${BASE}/register`,
  login: () => `${BASE}/login`,
  emailResend: () => `${BASE}/email/resend`,
} as const;
