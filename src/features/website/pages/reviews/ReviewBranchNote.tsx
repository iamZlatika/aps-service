import { useTranslation } from "react-i18next";

import { GoogleSpinnerIcon } from "@/features/website/pages/reviews/GoogleSpinnerIcon";

interface ReviewBranchNoteProps {
  address: string;
}

export const ReviewBranchNote = ({ address }: ReviewBranchNoteProps) => {
  const { t } = useTranslation("website");

  return (
    <div className="mb-5 flex items-center gap-2.5 text-ws-sm text-ws-ink-soft">
      <GoogleSpinnerIcon
        className="h-[15px] w-[15px] shrink-0"
        strokeWidth={6}
      />
      <span>
        {t("reviews.branchNote")}{" "}
        <b className="font-semibold text-ws-ink">{address}</b>
      </span>
    </div>
  );
};
