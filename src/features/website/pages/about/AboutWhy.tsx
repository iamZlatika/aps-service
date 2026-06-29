import { useTranslation } from "react-i18next";

import { WHY_CARDS } from "./AboutPageData";

export const AboutWhy = () => {
  const { t } = useTranslation("website");

  return (
    <div className="mb-14 grid max-w-[980px] grid-cols-3 gap-4 max-[780px]:grid-cols-1">
      {WHY_CARDS.map(({ id, Icon, titleKey, textKey }) => (
        <div
          key={id}
          className="rounded-[16px] border border-ws-line bg-ws-card p-6"
        >
          <div
            aria-hidden="true"
            className="mb-4 flex h-11 w-11 items-center justify-center rounded-[12px] border border-[color-mix(in_oklab,var(--ws-ember)_24%,transparent)] bg-[color-mix(in_oklab,var(--ws-ember)_12%,transparent)] text-ws-ember-bright"
          >
            <Icon className="size-[22px]" />
          </div>
          <h3 className="mb-2 text-[16px] font-semibold tracking-[-0.005em] text-ws-ink">
            {t(titleKey)}
          </h3>
          <p className="text-ws-sm leading-[1.55] text-ws-ink-soft [text-wrap:pretty]">
            {t(textKey)}
          </p>
        </div>
      ))}
    </div>
  );
};
