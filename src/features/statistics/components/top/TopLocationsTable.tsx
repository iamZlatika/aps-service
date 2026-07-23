import { useTranslation } from "react-i18next";

import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table.tsx";

import type { TopStatistics } from "../../types.ts";

interface TopLocationsTableProps {
  locations: TopStatistics["locations"];
}

export const TopLocationsTable = ({ locations }: TopLocationsTableProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        {t("statistics.top.locations")}
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("statistics.filters.location")}</TableHead>
            <TableHead>{t("statistics.top.location_orders")}</TableHead>
            <TableHead>{t("statistics.top.location_payments")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location) => (
            <TableRow key={location.id}>
              <TableCell>{location.name}</TableCell>
              <TableCell>{location.orders}</TableCell>
              <TableCell>
                <MoneyAmount value={location.payments} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
