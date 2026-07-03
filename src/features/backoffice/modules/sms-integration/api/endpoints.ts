const BASE = "/backoffice/integrations/sms";

export const SMS_INTEGRATION_API = {
  balance: () => `${BASE}/balance`,
  messages: () => `${BASE}/messages`,
} as const;
