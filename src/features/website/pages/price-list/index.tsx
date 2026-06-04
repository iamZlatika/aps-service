import { Suspense, useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

import { WebsiteErrorFallback } from "@/features/website/components/ErrorFallback";
import { usePriceListAll } from "@/features/website/hooks/usePriceListAll";
import { cn } from "@/shared/lib/utils";

import { PriceNavBar } from "./components/PriceNavBar";
import { PricePageCta } from "./components/PricePageCta";
import { PriceSectionCard } from "./components/PriceSectionCard";
import { groupPriceListByCategory } from "./service";
import { usePricePageNav } from "./usePricePageNav";

const NAV_PILL_WIDTHS = [
  "w-20",
  "w-24",
  "w-28",
  "w-20",
  "w-32",
  "w-24",
  "w-20",
] as const;

const PriceNavSkeleton = () => (
  <div className="sticky top-[var(--ws-header-height,0px)] z-30 mb-6 flex flex-wrap gap-2 border-b border-ws-line-soft bg-[color-mix(in_oklab,var(--ws-bg)_92%,transparent)] py-3 backdrop-blur-[10px]">
    {NAV_PILL_WIDTHS.map((w, i) => (
      <div
        key={i}
        className={cn("h-9 animate-pulse rounded-full bg-ws-bg-3", w)}
      />
    ))}
  </div>
);

const PriceContentSkeleton = () => (
  <div className="flex flex-col gap-5">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="overflow-hidden rounded-[18px] border border-ws-line bg-[rgba(255,255,255,0.015)]"
      >
        <div className="flex items-center gap-3.5 border-b border-ws-line-soft px-[26px] py-[22px]">
          <div className="size-11 animate-pulse rounded-[12px] bg-ws-bg-3" />
          <div className="h-5 w-48 animate-pulse rounded bg-ws-bg-3" />
        </div>
        <div className="px-[26px] pb-4 pt-1.5">
          {Array.from({ length: 5 }).map((_, j) => (
            <div
              key={j}
              className="flex items-center justify-between border-b border-ws-line-soft py-3.5 last:border-0"
            >
              <div className="h-4 w-2/3 animate-pulse rounded bg-ws-bg-3" />
              <div className="h-4 w-16 animate-pulse rounded bg-ws-bg-3" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const PriceListContent = () => {
  const { priceList, hasNextPage, isLoadingMore, fetchNextPage } =
    usePriceListAll();
  const groups = groupPriceListByCategory(priceList);
  const { activeKey, registerSection, scrollTo } = usePricePageNav(
    groups[0]?.category.key ?? "",
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (hasNextPage && !isLoadingMore) {
      void fetchNextPage();
    }
  }, [hasNextPage, isLoadingMore, fetchNextPage]);

  useEffect(() => {
    const navEl = navRef.current;
    const containerEl = containerRef.current;
    if (!navEl || !containerEl) return;
    const observer = new ResizeObserver(() => {
      containerEl.style.setProperty(
        "--ws-price-nav-height",
        `${navEl.offsetHeight}px`,
      );
    });
    observer.observe(navEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <PriceNavBar
        groups={groups}
        activeKey={activeKey}
        onSelect={scrollTo}
        navRef={navRef}
      />
      <div className="flex flex-col gap-[18px]">
        {groups.map((g) => (
          <PriceSectionCard
            key={g.category.key}
            group={g}
            sectionRef={registerSection(g.category.key)}
          />
        ))}
      </div>
      <PricePageCta />
    </div>
  );
};

const PriceListPage = () => {
  const { t } = useTranslation("website");

  return (
    <section
      className="ws-section ws-contacts-section"
      aria-labelledby="price-list-heading"
    >
      <div className="ws-wrap">
        <header className="mb-5">
          <p className="ws-section-eyebrow">{t("priceModal.eyebrow")}</p>
          <h1 id="price-list-heading" className="ws-section-title">
            {t("pricePage.heading")}{" "}
            <strong>{t("pricePage.headingBold")}</strong>
          </h1>
        </header>

        <ErrorBoundary FallbackComponent={WebsiteErrorFallback}>
          <Suspense
            fallback={
              <>
                <PriceNavSkeleton />
                <PriceContentSkeleton />
              </>
            }
          >
            <PriceListContent />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
};

export default PriceListPage;
