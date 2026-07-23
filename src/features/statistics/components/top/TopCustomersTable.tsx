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

interface TopCustomersTableProps {
  customers: TopStatistics["customers"];
}

export const TopCustomersTable = ({ customers }: TopCustomersTableProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        {t("statistics.top.customers")}
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {t("statistics.top.customers_table.customer")}
            </TableHead>
            <TableHead>{t("statistics.top.customers_table.orders")}</TableHead>
            <TableHead>
              {t("statistics.top.customers_table.turnover")}
            </TableHead>
            <TableHead>{t("statistics.top.customers_table.profit")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.customerId}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.orders}</TableCell>
              <TableCell>
                <MoneyAmount value={customer.turnover} />
              </TableCell>
              <TableCell>
                <MoneyAmount value={customer.profit} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
