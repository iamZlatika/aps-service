import { useTranslation } from "react-i18next";

import { cn } from "@/shared/lib/utils";

interface TrackSpecsTableProps {
  deviceType: string;
  manufacturer: string;
  deviceModel: string;
  accessory: string | null;
}

export const TrackSpecsTable = ({
  deviceType,
  manufacturer,
  deviceModel,
  accessory,
}: TrackSpecsTableProps) => {
  const { t } = useTranslation("website");

  const rows = [
    { label: t("track.specs.deviceType"), value: deviceType },
    { label: t("track.specs.brand"), value: manufacturer },
    { label: t("track.specs.model"), value: deviceModel },
    { label: t("track.specs.accessories"), value: accessory },
  ];

  return (
    <dl className="overflow-hidden rounded-2xl border border-ws-line bg-white/[.015]">
      {rows.map(({ label, value }) => (
        <div
          key={label}
          className="grid grid-cols-[240px_1fr] items-baseline border-b border-ws-line-soft px-6 py-4 last:border-b-0 max-sm:grid-cols-1 max-sm:gap-1 max-sm:px-[18px] max-sm:py-3.5"
        >
          <dt className="text-ws-sm text-ws-ink-soft">{label}</dt>
          <dd
            className={cn(
              "text-ws-md font-medium leading-[1.4]",
              value ? "text-ws-ink" : "font-normal italic text-ws-ink-mute",
            )}
          >
            {value ?? t("track.specs.missing")}
          </dd>
        </div>
      ))}
    </dl>
  );
};
