import { useTranslation } from "react-i18next";

import { type Location } from "@/entities/location/types";
import { ExternalLinkIcon } from "@/features/website/components/icons/ExternalLinkIcon";
import { computeReviewStats } from "@/features/website/lib/service";
import { GoogleSpinnerIcon } from "@/features/website/pages/reviews/GoogleSpinnerIcon";
import { type Review } from "@/features/website/types";
import { useLocalize } from "@/shared/hooks/useLocalize";

interface ReviewsAsideProps {
  activeLocation: Location;
  reviews: Review[];
}

export const ReviewsAside = ({
  activeLocation,
  reviews,
}: ReviewsAsideProps) => {
  const { t } = useTranslation("website");
  const localize = useLocalize();
  const { avg, dist } = computeReviewStats(reviews.map((r) => r.rating));
  const reviewUrl = activeLocation.reviewUrl ?? "#";
  const address = localize(activeLocation.addressRu, activeLocation.addressUa);
  const avgDisplay = avg.toFixed(1);

  return (
    <aside className="ws-rv3-aside">
      <p className="ws-section-eyebrow">{t("reviews.eyebrow")}</p>
      <h1 id="reviews-heading">
        {t("reviews.heading")} <strong>{t("reviews.headingBold")}</strong>
      </h1>

      <div className="flex flex-col gap-4 rounded-[18px] border border-ws-line bg-[rgba(255,255,255,0.02)] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-xl border border-ws-line bg-ws-bg-2">
            <GoogleSpinnerIcon className="h-[26px] w-[26px]" withDot />
          </div>
          <div className="text-[44px] font-semibold leading-none tracking-tight text-ws-ink">
            {avgDisplay}
          </div>
          <div className="text-xs leading-relaxed text-ws-ink-mute">
            <b className="mb-0.5 block text-[13.5px] font-semibold text-ws-ink">
              {t("reviews.scoreLabel")}
            </b>
            {address} · {t("reviews.reviewsCount", { count: reviews.length })}
          </div>
        </div>

        {reviews.length > 0 && (
          <div
            className="flex gap-[3px] text-lg leading-none"
            aria-hidden="true"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={
                  i < Math.round(avg)
                    ? "text-yellow-400"
                    : "text-ws-ink-mute opacity-35"
                }
              >
                ★
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-[7px] border-t border-ws-line-soft pt-4">
          {dist.map(({ star, pct }) => (
            <div
              key={star}
              className="flex items-center gap-2.5 text-[11px] text-ws-ink-mute"
            >
              <span className="w-2.5 text-right font-semibold tabular-nums text-ws-ink-soft">
                {star}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ws-line">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-ws-ember to-ws-ember-bright"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 text-right tabular-nums">{pct}%</span>
            </div>
          ))}
        </div>

        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ws-reviews-cta flex transform-gpu items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-ws-ember-bright to-ws-ember px-5 py-3.5 text-sm font-semibold no-underline shadow-[0_12px_30px_-12px_rgba(238,122,58,0.5)] transition-transform hover:-translate-y-px"
        >
          <ExternalLinkIcon className="h-[15px] w-[15px] shrink-0" />
          {t("reviews.leaveReview")}
        </a>
      </div>
    </aside>
  );
};
