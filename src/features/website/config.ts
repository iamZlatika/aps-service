import { type ComponentType, type SVGProps } from "react";

import { TelegramIcon } from "@/features/website/components/icons/TelegramIcon";
import { ViberIcon } from "@/features/website/components/icons/ViberIcon";
import { WhatsappIcon } from "@/features/website/components/icons/WhatsappIcon";

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

export const MESSENGER_ICONS: Record<
  MessengerKey,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  telegram: TelegramIcon,
  viber: ViberIcon,
  whatsapp: WhatsappIcon,
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
