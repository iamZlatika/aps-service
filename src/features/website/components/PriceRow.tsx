import { useTranslation } from "react-i18next";

import { type PriceListItem } from "@/entities/price-list/types";
import { formatPrice } from "@/features/website/lib/service";
import { useLocalize } from "@/shared/hooks/useLocalize";

interface PriceRowProps {
  item: PriceListItem;
}

export const PriceRow = ({ item }: PriceRowProps) => {
  const { t } = useTranslation("website");
  const localize = useLocalize();
  const note = localize(item.priceNoteRu ?? "", item.priceNoteUk ?? "");

  return (
    <div className="flex items-baseline gap-4 border-b border-ws-line-soft py-3.5 last:border-b-0">
      <div className="min-w-0 flex-1 text-[14.5px] font-medium leading-[1.4] text-ws-ink">
        {localize(item.nameRu, item.nameUk)}
        {note && (
          <small className="mt-[3px] block text-[11.5px] font-normal leading-[1.4] text-ws-ink">
            {note}
          </small>
        )}
      </div>
      <div className="flex flex-shrink-0 items-baseline gap-[5px] font-bold tabular-nums text-ws-ember-bright">
        {item.price > 0 && (
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ws-ink-mute">
            {t("devices.from")}
          </span>
        )}
        <span className="text-[15px]">{formatPrice(item.price)}</span>
      </div>
    </div>
  );
};
