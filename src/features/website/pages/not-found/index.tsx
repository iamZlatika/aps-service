import { MoveRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { WEBSITE_LINKS } from "@/features/website/navigation";

export const NotFoundPage = () => {
  const { t } = useTranslation("website");

  return (
    <section className="ws-section" aria-labelledby="not-found-heading">
      <div className="ws-wrap flex flex-col items-center justify-center py-16 text-center md:py-24">
        <p className="ws-section-eyebrow">{t("notFound.eyebrow")}</p>

        <div
          aria-hidden="true"
          className="flex items-center gap-[0.04em] text-[clamp(110px,20vw,260px)] font-extralight leading-[0.9] tracking-[-0.04em] text-ws-ink"
        >
          <span>4</span>
          <span className="bg-gradient-to-b from-ws-ember-bright via-ws-ember to-ws-ember-deep bg-clip-text text-transparent">
            0
          </span>
          <span>4</span>
        </div>

        <h1
          id="not-found-heading"
          className="mt-6 max-w-[680px] text-ws-2xl font-light leading-[1.12] tracking-[-0.02em] text-ws-ink"
        >
          {t("notFound.title")}
        </h1>

        <p className="mt-4 max-w-[480px] text-ws-base leading-[1.6] text-ws-ink-soft">
          {t("notFound.subtitle")}
        </p>

        <Link
          to={WEBSITE_LINKS.home}
          className="ws-btn ws-btn-primary mt-8 justify-center"
        >
          {t("notFound.cta")}
          <MoveRight className="size-3.5" />
        </Link>

        <nav
          aria-label={t("nav.navigation")}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-ws-sm"
        >
          <Link
            to={WEBSITE_LINKS.priceList}
            className="text-ws-ink-soft no-underline transition-colors duration-150 hover:text-ws-ember-bright"
          >
            {t("nav.priceList")}
          </Link>
          <Link
            to={WEBSITE_LINKS.works}
            className="text-ws-ink-soft no-underline transition-colors duration-150 hover:text-ws-ember-bright"
          >
            {t("nav.works")}
          </Link>
          <Link
            to={WEBSITE_LINKS.reviews}
            className="text-ws-ink-soft no-underline transition-colors duration-150 hover:text-ws-ember-bright"
          >
            {t("nav.reviews")}
          </Link>
          <Link
            to={WEBSITE_LINKS.contacts}
            className="text-ws-ink-soft no-underline transition-colors duration-150 hover:text-ws-ember-bright"
          >
            {t("nav.contacts")}
          </Link>
        </nav>
      </div>
    </section>
  );
};

export default NotFoundPage;
