import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { MESSENGER_ICONS } from "@/features/website/components/Header/HeaderData";
import { MESSENGERS } from "@/features/website/config";
import { useLocations } from "@/features/website/hooks/useLocations";
import { getMessengerHref } from "@/features/website/lib/service";
import { cn } from "@/shared/lib/utils";

const BB_MESSENGERS = ["telegram", "whatsapp"] as const;

interface MobileBottomBarProps {
  isOpen: boolean;
}

export const MobileBottomBar = ({ isOpen }: MobileBottomBarProps) => {
  const { t } = useTranslation("website");
  const { locations } = useLocations();
  const mainPhone = locations[0]?.phone ?? "";
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "ws-bottombar fixed bottom-3 left-3 right-3 z-[55] flex items-center gap-2 rounded-ws-card border border-ws-line p-2 transition-transform duration-300 md:hidden",
        footerVisible && "translate-y-[calc(100%_+_12px)]",
        isOpen && "hidden",
      )}
    >
      {BB_MESSENGERS.map((key) => {
        const messenger = MESSENGERS.find((m) => m.key === key);
        if (!messenger) return null;
        const Icon = MESSENGER_ICONS[key];
        return (
          <a
            key={key}
            href={getMessengerHref(key, mainPhone)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(`messenger.${key}`)}
            className={cn(
              "flex flex-1 items-center justify-center gap-[7px] rounded-ws-md border border-ws-line-soft bg-white/[0.02] px-1 py-[13px] text-[12.5px] font-semibold tracking-[0.005em] no-underline transition-colors duration-200 [&>svg]:size-3.5 [&>svg]:shrink-0",
              messenger.colorClass,
            )}
          >
            <Icon />
            {t(`messenger.${key}`)}
          </a>
        );
      })}
      <a
        href={`tel:${mainPhone}`}
        className="ws-bb-btn-primary flex flex-1 items-center justify-center gap-[7px] rounded-ws-md px-1 py-[13px] text-[12.5px] font-semibold tracking-[0.005em] no-underline [&>svg]:size-3.5 [&>svg]:shrink-0"
      >
        <Phone />
        <span>{t("nav.call")}</span>
      </a>
    </div>
  );
};
