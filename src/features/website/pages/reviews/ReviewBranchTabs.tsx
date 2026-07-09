import { type KeyboardEvent, useRef } from "react";

import { type Location } from "@/entities/location/types";
import { PinIcon } from "@/features/website/components/icons/PinIcon";
import { useLocalize } from "@/shared/hooks/useLocalize";
import { cn } from "@/shared/lib/utils";

interface ReviewBranchTabsProps {
  locations: Location[];
  reviewCounts: Map<number, number>;
  activeLocationId: number;
  panelId: string;
  onSelect: (locationId: number) => void;
}

export const ReviewBranchTabs = ({
  locations,
  reviewCounts,
  activeLocationId,
  panelId,
  onSelect,
}: ReviewBranchTabsProps) => {
  const localize = useLocalize();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + delta + locations.length) % locations.length;
    onSelect(locations[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="tablist"
      className="ws-review-tabs mb-5 flex w-fit max-w-full gap-1.5 rounded-[14px] border border-ws-line p-[5px]"
    >
      {locations.map((location, index) => {
        const isActive = location.id === activeLocationId;
        const street = localize(location.streetRu, location.streetUa);

        return (
          <button
            key={location.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`review-tab-${location.id}`}
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(location.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "inline-flex items-center gap-[9px] whitespace-nowrap rounded-[10px] px-[18px] py-[11px] text-sm font-semibold transition-colors",
              isActive
                ? "bg-ws-cream text-ws-bg"
                : "text-ws-ink-soft hover:text-ws-ink",
            )}
          >
            <PinIcon className="h-[15px] w-[15px] shrink-0" />
            {street}, {location.building}
            <span className="text-[11px] font-semibold opacity-70">
              · {reviewCounts.get(location.id) ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
};
