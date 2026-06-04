import { Suspense, useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

import { WebsiteErrorFallback } from "@/features/website/components/ErrorFallback";
import { usePriceListAll } from "@/features/website/hooks/usePriceListAll";

import { PriceNavBar } from "./components/PriceNavBar";
import { PricePageCta } from "./components/PricePageCta";
import { PriceSectionCard } from "./components/PriceSectionCard";
import { PriceSkeleton } from "./components/PriceSkeleton";
import { groupPriceListByCategory } from "./service";
import { usePricePageNav } from "./usePricePageNav";

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
    <div
      ref={containerRef}
      className="lg:grid lg:grid-cols-[248px_1fr] lg:items-start lg:gap-12"
    >
      <PriceNavBar
        groups={groups}
        activeKey={activeKey}
        onSelect={scrollTo}
        navRef={navRef}
      />
      <div>
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
          <Suspense fallback={<PriceSkeleton />}>
            <PriceListContent />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
};

export default PriceListPage;
