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

import type { StaffRow } from "../../types.ts";

interface StaffTableProps {
  rows: StaffRow[];
}

export const StaffTable = ({ rows }: StaffTableProps) => {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("statistics.staff.master")}</TableHead>
          <TableHead>{t("statistics.staff.closed")}</TableHead>
          <TableHead>{t("statistics.staff.turnover")}</TableHead>
          <TableHead>{t("statistics.staff.margin")}</TableHead>
          <TableHead>{t("statistics.staff.earned")}</TableHead>
          <TableHead>{t("statistics.staff.paid_out")}</TableHead>
          <TableHead>{t("statistics.staff.balance")}</TableHead>
          <TableHead>{t("statistics.staff.available")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.userId}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.period.closed}</TableCell>
            <TableCell>
              <MoneyAmount value={row.period.turnover} />
            </TableCell>
            <TableCell>
              <MoneyAmount value={row.period.margin} />
            </TableCell>
            <TableCell>
              <MoneyAmount value={row.period.earned} />
            </TableCell>
            <TableCell>
              <MoneyAmount value={row.period.paidOut} />
            </TableCell>
            <TableCell>
              <MoneyAmount value={row.snapshot.balance} />
            </TableCell>
            <TableCell>
              <MoneyAmount value={row.snapshot.available} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
