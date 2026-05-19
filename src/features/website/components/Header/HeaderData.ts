import { type ComponentType, type SVGProps } from "react";

import { TelegramIcon } from "@/features/website/components/icons/TelegramIcon";
import { ViberIcon } from "@/features/website/components/icons/ViberIcon";
import { WhatsappIcon } from "@/features/website/components/icons/WhatsappIcon";
import { type MessengerKey } from "@/features/website/config";
import { WEBSITE_LINKS } from "@/features/website/navigation";

export const NAV_TABS = [
  { labelKey: "nav.home", to: WEBSITE_LINKS.home, end: true },
  { labelKey: "nav.contacts", to: WEBSITE_LINKS.contacts, end: false },
  { labelKey: "nav.works", to: WEBSITE_LINKS.works, end: false },
  { labelKey: "nav.reviews", to: WEBSITE_LINKS.reviews, end: false },
] as const;

export const MESSENGER_ICONS: Record<
  MessengerKey,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  telegram: TelegramIcon,
  viber: ViberIcon,
  whatsapp: WhatsappIcon,
};
