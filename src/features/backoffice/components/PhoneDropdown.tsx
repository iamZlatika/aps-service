import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

import { TelegramIcon } from "@/features/backoffice/components/icons/TelegramIcon";
import { ViberIcon } from "@/features/backoffice/components/icons/ViberIcon";
import { WhatsAppIcon } from "@/features/backoffice/components/icons/WhatsAppIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu.tsx";
import { stripNonDigits } from "@/shared/lib/utils";

interface PhoneDropdownProps {
  phoneNumber: string;
  size?: "sm" | "md";
}

export const PhoneDropdown = ({
  phoneNumber,
  size = "sm",
}: PhoneDropdownProps) => {
  const { t } = useTranslation();
  const digits = stripNonDigits(phoneNumber);
  const whatsappUrl = `https://wa.me/${digits}`;
  const viberUrl = `viber://chat?number=%2B${digits}`;
  const telegramUrl = `https://telegram.me/+${digits}`;

  const triggerClass =
    size === "md"
      ? "text-blue-500 text-base cursor-pointer hover:underline"
      : "text-blue-500 text-sm cursor-pointer hover:underline";

  const iconClass = size === "md" ? "h-5 w-5" : "h-4 w-4";
  const itemClass = size === "md" ? "text-base py-2" : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className={triggerClass}>{phoneNumber}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild className={itemClass}>
          <a href={`tel:${phoneNumber}`}>
            <Phone className={iconClass} />
            <span>{t("common.phone_dropdown.call")}</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={itemClass}>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className={iconClass} />
            <span>{t("common.phone_dropdown.whatsapp")}</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={itemClass}>
          <a href={viberUrl}>
            <ViberIcon className={iconClass} />
            <span>{t("common.phone_dropdown.viber")}</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={itemClass}>
          <a href={telegramUrl}>
            <TelegramIcon className={iconClass} />
            <span>{t("common.phone_dropdown.telegram")}</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
