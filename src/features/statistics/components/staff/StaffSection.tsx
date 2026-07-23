import { useTranslation } from "react-i18next";

import { useStaffStatistics } from "../../hooks/useStaffStatistics.ts";
import type { StatisticsFilters } from "../../types.ts";
import { StatisticsSectionGuard } from "../StatisticsSectionGuard.tsx";
import { StaffTable } from "./StaffTable.tsx";

interface StaffSectionProps {
  filters: StatisticsFilters;
}

export const StaffSection = ({ filters }: StaffSectionProps) => {
  const { t } = useTranslation();
  const { staff, isLoading, isError, error, refetch } =
    useStaffStatistics(filters);

  const isEmpty = !!staff && staff.rows.length === 0;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{t("statistics.staff.title")}</h2>
      <StatisticsSectionGuard
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={isEmpty}
        onRetry={refetch}
      >
        {staff && <StaffTable rows={staff.rows} />}
      </StatisticsSectionGuard>
    </section>
  );
};
