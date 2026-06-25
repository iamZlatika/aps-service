import { type RefCallback } from "react";

import { DEVICE_ICONS } from "@/features/website/components/DeviceIcons";
import { PriceRow } from "@/features/website/components/PriceRow";
import { useLocalize } from "@/shared/hooks/useLocalize";

import { getDeviceIdForCategory, type PriceGroup } from "../service";

interface PriceSectionCardProps {
  group: PriceGroup;
  sectionRef: RefCallback<HTMLElement>;
}

export const PriceSectionCard = ({
  group,
  sectionRef,
}: PriceSectionCardProps) => {
  const localize = useLocalize();
  const deviceId = getDeviceIdForCategory(group.category.key);

  return (
    <section
      ref={sectionRef}
      id={`price-section-${group.category.key}`}
      className="scroll-mt-[calc(var(--ws-header-height,0px)_+_var(--ws-price-nav-height,0px)_+_16px)] overflow-hidden rounded-[18px] border border-ws-line bg-ws-card lg:scroll-mt-[calc(var(--ws-header-height,0px)_+_24px)]"
    >
      <div className="flex items-center gap-3.5 border-b border-ws-line-soft px-[26px] py-[22px] max-sm:px-[18px]">
        <div
          aria-hidden="true"
          className="flex size-11 flex-shrink-0 items-center justify-center rounded-[12px] border border-[color-mix(in_oklab,var(--ws-ember)_24%,transparent)] bg-[color-mix(in_oklab,var(--ws-ember)_12%,transparent)] p-[11px] text-ws-ember-bright"
        >
          {DEVICE_ICONS[deviceId]}
        </div>
        <h2 className="text-balance text-[19px] font-semibold leading-[1.25] tracking-[-0.01em] text-ws-ink max-sm:text-[17px]">
          {localize(group.category.nameRu, group.category.nameUk)}
        </h2>
      </div>
      <div className="px-[26px] pb-4 pt-1.5 max-sm:px-[18px]">
        {group.items.map((item) => (
          <PriceRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
