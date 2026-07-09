import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

import { WebsiteErrorFallback } from "@/features/website/components/ErrorFallback";
import { useAllLocationReviews } from "@/features/website/hooks/useAllLocationReviews";
import { useLocations } from "@/features/website/hooks/useLocations";
import { ReviewBranchNote } from "@/features/website/pages/reviews/ReviewBranchNote";
import { ReviewBranchTabs } from "@/features/website/pages/reviews/ReviewBranchTabs";
import { ReviewCard } from "@/features/website/pages/reviews/ReviewCard";
import { ReviewsAside } from "@/features/website/pages/reviews/ReviewsAside";
import { useLocalize } from "@/shared/hooks/useLocalize";

const ReviewsSkeleton = () => {
  const { t } = useTranslation("website");
  return (
    <div className="ws-rv3">
      <div className="ws-rv3-aside flex flex-col gap-5">
        <p className="ws-section-eyebrow">{t("reviews.eyebrow")}</p>
        <h1 id="reviews-heading">
          {t("reviews.heading")} <strong>{t("reviews.headingBold")}</strong>
        </h1>
        <div className="h-[220px] animate-pulse rounded-[18px] bg-ws-bg-3" />
      </div>
      <div className="ws-rv3-wall">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="mb-[18px] break-inside-avoid h-[150px] animate-pulse rounded-[16px] bg-ws-bg-3"
          />
        ))}
      </div>
    </div>
  );
};

const REVIEWS_WALL_PANEL_ID = "reviews-wall-panel";

const ReviewsContent = () => {
  const { t } = useTranslation("website");
  const localize = useLocalize();
  const { locations } = useLocations();
  const allReviews = useAllLocationReviews(locations);
  const [activeLocationId, setActiveLocationId] = useState(locations[0]?.id);

  if (locations.length === 0) {
    return null;
  }

  const activeLocation =
    locations.find((location) => location.id === activeLocationId) ??
    locations[0];
  const activeReviews =
    allReviews.find((entry) => entry.locationId === activeLocation.id)
      ?.reviews ?? [];
  const reviewCounts = new Map(
    allReviews.map((entry) => [entry.locationId, entry.reviews.length]),
  );
  const activeAddress = localize(
    activeLocation.addressRu,
    activeLocation.addressUa,
  );

  return (
    <div className="ws-rv3">
      <ReviewsAside activeLocation={activeLocation} reviews={activeReviews} />
      <div className="min-w-0">
        <ReviewBranchTabs
          locations={locations}
          reviewCounts={reviewCounts}
          activeLocationId={activeLocation.id}
          panelId={REVIEWS_WALL_PANEL_ID}
          onSelect={setActiveLocationId}
        />
        <ReviewBranchNote address={activeAddress} />
        <div
          id={REVIEWS_WALL_PANEL_ID}
          role="tabpanel"
          aria-labelledby={`review-tab-${activeLocation.id}`}
          tabIndex={0}
          className="ws-rv3-wall"
        >
          {activeReviews.length > 0 ? (
            activeReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <p className="text-ws-sm text-ws-ink-mute">{t("reviews.empty")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ReviewsPage = () => (
  <section
    className="ws-section ws-reviews-section"
    aria-labelledby="reviews-heading"
  >
    <div className="ws-wrap">
      <ErrorBoundary FallbackComponent={WebsiteErrorFallback}>
        <Suspense fallback={<ReviewsSkeleton />}>
          <ReviewsContent />
        </Suspense>
      </ErrorBoundary>
    </div>
  </section>
);

export default ReviewsPage;
