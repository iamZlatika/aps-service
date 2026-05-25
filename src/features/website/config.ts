export const MESSENGER_KEYS = {
  TELEGRAM: "telegram",
  VIBER: "viber",
  WHATSAPP: "whatsapp",
} as const;

export type MessengerKey = (typeof MESSENGER_KEYS)[keyof typeof MESSENGER_KEYS];

export type MessengerConfig = {
  key: MessengerKey;
  hoverClass: string;
  colorClass: string;
};

export const MESSENGERS: MessengerConfig[] = [
  {
    key: "telegram",
    hoverClass: "ws-msg-tg",
    colorClass: "ws-msg-tg-color",
  },
  {
    key: "viber",
    hoverClass: "ws-msg-vb",
    colorClass: "ws-msg-vb-color",
  },
  {
    key: "whatsapp",
    hoverClass: "ws-msg-wa",
    colorClass: "ws-msg-wa-color",
  },
];
