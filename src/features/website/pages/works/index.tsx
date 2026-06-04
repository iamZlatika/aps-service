import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

import { WebsiteErrorFallback } from "@/features/website/components/ErrorFallback";
import { useWorks } from "@/features/website/hooks/useWorks";

import { WorkCard } from "./components/WorkCard";

const WorksListSkeleton = () => (
  <div className="flex flex-col gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="overflow-hidden rounded-[20px] border border-ws-line bg-[rgba(255,255,255,0.015)]"
      >
        <div className="grid grid-cols-2 max-[860px]:grid-cols-1">
          <div className="grid grid-cols-2 gap-[2px] bg-ws-line-soft">
            <div className="aspect-[3/4] animate-pulse bg-ws-bg-3 max-[860px]:aspect-square" />
            <div className="aspect-[3/4] animate-pulse bg-ws-bg-3 max-[860px]:aspect-square" />
          </div>
          <div className="flex flex-col gap-5 p-8">
            <div className="h-24 animate-pulse rounded-[14px] bg-ws-bg-3" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-32 animate-pulse rounded bg-ws-bg-3" />
              <div className="h-4 w-full animate-pulse rounded bg-ws-bg-3" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-ws-bg-3" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const WorksList = () => {
  const { works } = useWorks();

  return (
    <div className="ws-works-list">
      {works.map((work, i) => (
        <WorkCard key={work.id} work={work} isReverse={i % 2 !== 0} />
      ))}
    </div>
  );
};

const WorksPage = () => {
  const { t } = useTranslation("website");

  return (
    <section
      className="ws-section ws-works-section"
      aria-labelledby="works-heading"
    >
      <div className="ws-wrap">
        <header className="mb-5">
          <p className="ws-section-eyebrow">{t("works.eyebrow")}</p>
          <h1 id="works-heading" className="ws-section-title">
            {t("works.heading")} <strong>{t("works.headingBold")}</strong>
          </h1>
        </header>

        <ErrorBoundary FallbackComponent={WebsiteErrorFallback}>
          <Suspense fallback={<WorksListSkeleton />}>
            <WorksList />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
};

export default WorksPage;
