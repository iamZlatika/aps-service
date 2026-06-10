import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

import { WebsiteErrorFallback } from "@/features/website/components/ErrorFallback";
import { useReviews } from "@/features/website/hooks/useReviews";
import { ReviewCard } from "@/features/website/pages/reviews/ReviewCard";
import { ReviewsAside } from "@/features/website/pages/reviews/ReviewsAside";

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

const ReviewsContent = () => {
  const { reviews } = useReviews();
  return (
    <div className="ws-rv3">
      <ReviewsAside reviews={reviews} />
      <div className="ws-rv3-wall">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
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
