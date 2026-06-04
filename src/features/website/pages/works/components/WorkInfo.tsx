import { useTranslation } from "react-i18next";

import { type Work } from "@/entities/work/types";
import { useLocalize } from "@/shared/hooks/useLocalize";

interface WorkInfoProps {
  work: Work;
}

export const WorkInfo = ({ work }: WorkInfoProps) => {
  const { t } = useTranslation("website");
  const localize = useLocalize();

  const reason = localize(
    work.reasonRu ?? work.reasonUk ?? "",
    work.reasonUk ?? work.reasonRu ?? "",
  );
  const description = localize(work.descriptionRu, work.descriptionUk);

  return (
    <div className="ws-work-info flex flex-col gap-5 p-8 max-sm:px-5 max-sm:py-[22px]">
      <dl className="overflow-hidden rounded-[14px] border border-ws-line-soft">
        <div className="grid grid-cols-[130px_1fr] items-baseline gap-3.5 border-b border-ws-line-soft px-4 py-3 max-sm:grid-cols-[104px_1fr] max-sm:gap-2.5 max-sm:px-3.5 max-sm:py-[11px]">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ws-ink-mute">
            {t("works.deviceType")}
          </dt>
          <dd className="text-[14.5px] font-semibold leading-[1.35] text-ws-ink">
            {work.deviceType}
          </dd>
        </div>
        <div className="grid grid-cols-[130px_1fr] items-baseline gap-3.5 border-b border-ws-line-soft px-4 py-3 max-sm:grid-cols-[104px_1fr] max-sm:gap-2.5 max-sm:px-3.5 max-sm:py-[11px]">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ws-ink-mute">
            {t("works.brand")}
          </dt>
          <dd className="text-[14.5px] font-semibold leading-[1.35] text-ws-ink">
            {work.manufacturer}
          </dd>
        </div>
        <div className="grid grid-cols-[130px_1fr] items-baseline gap-3.5 px-4 py-3 max-sm:grid-cols-[104px_1fr] max-sm:gap-2.5 max-sm:px-3.5 max-sm:py-[11px]">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ws-ink-mute">
            {t("works.model")}
          </dt>
          <dd className="text-[14.5px] font-semibold leading-[1.35] text-ws-ink">
            {work.deviceModel}
          </dd>
        </div>
      </dl>

      {reason && (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ws-ember-bright">
            {t("works.reason")}
          </span>
          <p className="text-[15px] leading-[1.6] text-ws-ink-soft text-pretty">
            {reason}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ws-ember-bright">
          {t("works.fix")}
        </span>
        <p className="text-[15px] leading-[1.6] text-ws-ink-soft text-pretty">
          {description}
        </p>
      </div>
    </div>
  );
};
