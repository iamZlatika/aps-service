import { useTranslation } from "react-i18next";

import {
  computeReviewStats,
  getGoogleReviewUrl,
} from "@/features/website/lib/service";
import { GoogleSpinnerIcon } from "@/features/website/pages/reviews/GoogleSpinnerIcon";
import { type Review } from "@/features/website/types";

interface ReviewsAsideProps {
  reviews: Review[];
}

export const ReviewsAside = ({ reviews }: ReviewsAsideProps) => {
  const { t } = useTranslation("website");
  const { avg, dist } = computeReviewStats(reviews.map((r) => r.rating));
  const reviewUrl =
    reviews.length > 0 ? getGoogleReviewUrl(reviews[0].id) : "#";
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
            {t("reviews.reviewsCount", { count: reviews.length })}
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
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-ws-ember-bright to-ws-ember px-5 py-3.5 text-sm font-semibold text-[#2a1a0d] no-underline shadow-[0_12px_30px_-12px_rgba(238,122,58,0.5)] transition-transform hover:-translate-y-px"
        >
          <svg
            className="h-[15px] w-[15px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 3h7v7" />
            <path d="M21 3l-9 9" />
            <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          </svg>
          {t("reviews.leaveReview")}
        </a>
      </div>
    </aside>
  );
};
