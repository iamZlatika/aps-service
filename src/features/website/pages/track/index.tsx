import { Info } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { WebsiteLoader } from "@/features/website/components/Loader";
import { OrderHistoryAccordion } from "@/features/website/components/OrderHistoryAccordion";
import { StatusBadge } from "@/features/website/components/StatusBadge";
import { useOrderTracking } from "@/features/website/hooks/useOrderTracking";
import { TrackSpecsTable } from "@/features/website/pages/track/components/TrackSpecsTable";
import { buildOrderHistory } from "@/features/website/pages/track/services";
import { QueryPageGuard } from "@/shared/components/errors/QueryPageGuard";

export const TrackPage = () => {
  const { token = "" } = useParams<{ token: string }>();
  const { track, isLoading, isError, error, refetch } = useOrderTracking(token);
  const { t } = useTranslation("website");

  const history = useMemo(
    () => (track ? buildOrderHistory(track) : []),
    [track],
  );

  return (
    <QueryPageGuard
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={refetch}
      buttonClassName="bg-[var(--ws-bg-2)] text-[var(--ws-ink)] border-[var(--ws-line)] hover:bg-[var(--ws-bg-3)]"
      loadingFallback={
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ws-bg">
          <WebsiteLoader />
        </div>
      }
    >
      {track && (
        <div className="ws-wrap">
          <section
            aria-labelledby="track-order-heading"
            className="pb-20 pt-12 max-sm:pt-8"
          >
            <p className="ws-section-eyebrow mb-4">{t("track.eyebrow")}</p>

            <h1
              id="track-order-heading"
              className="ws-section-title tabular-nums"
            >
              {track.orderNumber}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-3.5 border-b border-ws-line-soft pb-8">
              <span className="text-ws-sm tracking-[.01em] text-ws-ink-mute">
                {t("track.statusLabel")}
              </span>
              <StatusBadge status={track.status} />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-[18px] max-sm:grid-cols-1">
              <div className="rounded-2xl border border-ws-line bg-white/[.015] px-6 py-[22px] max-sm:px-[18px]">
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.16em] text-ws-ink-mute">
                  {t("track.issue.label")}
                </p>
                <p className="text-ws-xl font-medium leading-[1.4] text-ws-ink">
                  {track.issueType}
                </p>
              </div>

              <div className="rounded-2xl border border-ws-line bg-white/[.015] px-6 py-[22px] max-sm:px-[18px]">
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[.16em] text-ws-ink-mute">
                  {t("track.cost.label")}
                </p>
                <p
                  className={
                    track.estimatedCost
                      ? "text-ws-xl font-medium leading-[1.4] text-ws-ink"
                      : "text-ws-lg font-normal italic leading-[1.4] text-ws-ink-mute"
                  }
                >
                  {track.estimatedCost ?? t("track.cost.pending")}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <OrderHistoryAccordion items={history} />
            </div>

            <p className="mb-[18px] mt-12 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[.18em] text-ws-ink-mute after:h-px after:flex-1 after:bg-ws-line-soft after:content-[''] max-sm:mt-7">
              {t("track.specs.title")}
            </p>

            <TrackSpecsTable
              deviceType={track.deviceType}
              manufacturer={track.manufacturer}
              deviceModel={track.deviceModel}
              accessory={track.accessory}
            />

            <div className="mt-7 flex items-start gap-3 rounded-xl border border-dashed border-ws-line px-5 py-4 text-ws-sm leading-[1.55] text-ws-ink-mute">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-ws-ember-bright" />
              <span>{t("track.note")}</span>
            </div>
          </section>
        </div>
      )}
    </QueryPageGuard>
  );
};

export default TrackPage;
