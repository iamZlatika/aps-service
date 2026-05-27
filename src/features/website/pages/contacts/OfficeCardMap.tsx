import { useTranslation } from "react-i18next";

import { ExternalLinkIcon } from "@/features/website/components/icons/ExternalLinkIcon";
import { getMapEmbedSrc, getMapsUrl } from "@/features/website/lib/service";

interface OfficeCardMapProps {
  address: string;
  street: string;
  building: string;
}

export const OfficeCardMap = ({
  address,
  street,
  building,
}: OfficeCardMapProps) => {
  const { t } = useTranslation("website");

  return (
    <div className="ws-contacts-map">
      <a
        href={getMapsUrl(address)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("contacts.openMapsLabel")}
        className="absolute top-3.5 right-3.5 z-[2] flex items-center gap-2 px-3.5 py-2.5 rounded-ws-sm border border-ws-line bg-ws-bg-2/90 backdrop-blur-[10px] text-ws-ink no-underline text-ws-xs font-semibold hover:border-ws-ember transition-colors"
      >
        <ExternalLinkIcon className="size-3.5 shrink-0" />
        <span aria-hidden="true">{t("contacts.openMaps")}</span>
      </a>
      <iframe
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        src={getMapEmbedSrc(address)}
        title={`${street}, ${building}`}
        className="ws-contacts-map-iframe"
      />
    </div>
  );
};
