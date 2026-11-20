import { useTranslation } from "react-i18next";

import { getSaleDocument } from "@/features/warehouse/lib/service.ts";
import type { SaleInfo } from "@/features/warehouse/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { formatDate } from "@/shared/lib/utils.ts";

interface SaleSummaryProps {
  sale: SaleInfo;
}

/**
 * "Order #841 · 1 700 ₴ · 20.11.2026" — plain text, because it sits in
 * clickable table rows (the card shows the same as links).
 */
export const SaleSummary = ({ sale }: SaleSummaryProps) => {
  const { t } = useTranslation();
  const document = getSaleDocument(sale);

  return (
    <span className="whitespace-nowrap">
      {document &&
        t(
          document.kind === "order"
            ? "warehouse.stock.order"
            : "warehouse.stock.quickOrder",
          { id: document.id },
        )}
      {sale.soldPrice && (
        <>
          {" · "}
          <MoneyAmount value={sale.soldPrice} />
        </>
      )}
      {sale.soldAt && ` · ${formatDate(sale.soldAt)}`}
    </span>
  );
};
