import { useTranslation } from "react-i18next";

import { DONOR_STATUS_FILTER_KEY } from "@/features/warehouse/lib/constants.ts";
import {
  parseDonorStatusFilter,
  toDonorStatusParam,
} from "@/features/warehouse/lib/service.ts";
import {
  DONOR_STATUS_FILTERS,
  type DonorStatusFilter,
} from "@/features/warehouse/types.ts";
import SegmentedControl from "@/shared/components/SegmentedControl.tsx";
import { useFilterParams } from "@/widgets/table/hooks/useFilterParams.ts";

/** In stock (default) / Sold / All — a sold donor no longer disappears. */
export const DonorStatusSwitch = () => {
  const { t } = useTranslation();
  const { filters, setFilter } = useFilterParams();

  return (
    <div className="w-72">
      <SegmentedControl<DonorStatusFilter>
        value={parseDonorStatusFilter(filters[DONOR_STATUS_FILTER_KEY])}
        options={Object.values(DONOR_STATUS_FILTERS).map((status) => ({
          value: status,
          label: t(`warehouse.donorStatuses.${status}`),
        }))}
        onChange={(status) =>
          setFilter(DONOR_STATUS_FILTER_KEY, toDonorStatusParam(status))
        }
      />
    </div>
  );
};
