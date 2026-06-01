import { useTranslation } from "react-i18next";

import { StatusBadge } from "@/features/website/components/StatusBadge";
import { type OrderPreview } from "@/features/website/types";

interface OrderPreviewResultProps {
  data: OrderPreview;
  onClose: () => void;
}

const specRowClass =
  "grid grid-cols-[160px_1fr] items-baseline gap-[14px] border-b border-ws-line-soft px-[18px] py-[13px] last:border-b-0 max-[520px]:grid-cols-1 max-[520px]:gap-[3px] max-[520px]:px-[14px] max-[520px]:py-[11px]";

export const TrackStatusModalResult = ({
  data,
  onClose,
}: OrderPreviewResultProps) => {
  const { t } = useTranslation("website");

  return (
    <>
      <header className="mb-[22px] flex flex-col gap-2">
        <div className="inline-flex items-center gap-[10px] text-[18px] font-bold uppercase tracking-[.06em] text-ws-ember-bright">
          <span
            className="h-[1.5px] w-7 shrink-0 bg-ws-ember-bright"
            aria-hidden="true"
          />
          {t("track.eyebrow")}
        </div>
        <p className="text-[clamp(22px,2.6vw,32px)] font-light leading-[1.15] tracking-[-0.015em] text-ws-ink-soft tabular-nums">
          {data.orderNumber}
        </p>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-ws-sm tracking-[.01em] text-ws-ink-mute">
            {t("track.statusLabel")}
          </span>
          <StatusBadge status={data.status} />
        </div>
      </header>

      <div className="mb-[10px] flex items-center gap-[10px] text-[11px] font-semibold uppercase tracking-[.16em] text-ws-ink-mute">
        {t("track.specs.title")}
        <span className="h-px flex-1 bg-ws-line-soft" aria-hidden="true" />
      </div>

      <dl className="overflow-hidden rounded-[14px] border border-ws-line bg-white/[.018]">
        <div className={specRowClass}>
          <dt className="text-[12px] tracking-[.005em] text-ws-ink-soft">
            {t("track.specs.deviceType")}
          </dt>
          <dd className="text-[14px] font-medium leading-[1.4] text-ws-ink">
            {data.deviceType}
          </dd>
        </div>
        <div className={specRowClass}>
          <dt className="text-[12px] tracking-[.005em] text-ws-ink-soft">
            {t("track.specs.brand")}
          </dt>
          <dd className="text-[14px] font-medium leading-[1.4] text-ws-ink">
            {data.manufacturer}
          </dd>
        </div>
        <div className={specRowClass}>
          <dt className="text-[12px] tracking-[.005em] text-ws-ink-soft">
            {t("track.specs.model")}
          </dt>
          <dd className="text-[14px] font-medium leading-[1.4] text-ws-ink">
            {data.deviceModel}
          </dd>
        </div>
        <div className={specRowClass}>
          <dt className="text-[12px] tracking-[.005em] text-ws-ink-soft">
            {t("track.issue.label")}
          </dt>
          <dd className="text-[14px] font-medium leading-[1.4] text-ws-ink">
            {data.issueType}
          </dd>
        </div>
      </dl>

      <div className="mt-[18px]">
        <button
          type="button"
          onClick={onClose}
          className="ws-btn ws-btn-ghost w-full justify-center"
        >
          {t("trackModal.close")}
        </button>
      </div>
    </>
  );
};
