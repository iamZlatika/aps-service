import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { WAREHOUSE_LINKS } from "@/features/warehouse/navigation.ts";
import { Badge } from "@/shared/components/ui/badge.tsx";

interface WarehouseLineBadgeProps {
  warehouseItemId: number | null;
  donorPartId: number | null;
  warehouseDonorId?: number | null;
}

/**
 * Where an order / quick-sale line came from. There is no single-part screen,
 * so a donor part leads to the parts list; a sold donor keeps its card.
 */
type LineTarget = { link: string; labelKey: string };

function getLineTarget(
  warehouseItemId: number | null,
  donorPartId: number | null,
  warehouseDonorId: number | null,
): LineTarget | null {
  if (warehouseDonorId !== null) {
    return {
      link: WAREHOUSE_LINKS.donor(warehouseDonorId),
      labelKey: "warehouse.badges.wholeDonor",
    };
  }
  if (warehouseItemId !== null) {
    return {
      link: WAREHOUSE_LINKS.item(warehouseItemId),
      labelKey: "warehouse.badges.warehouse",
    };
  }
  if (donorPartId !== null) {
    return {
      link: WAREHOUSE_LINKS.parts(),
      labelKey: "warehouse.badges.donor",
    };
  }
  return null;
}

export const WarehouseLineBadge = ({
  warehouseItemId,
  donorPartId,
  warehouseDonorId = null,
}: WarehouseLineBadgeProps) => {
  const { t } = useTranslation();

  const target = getLineTarget(warehouseItemId, donorPartId, warehouseDonorId);
  if (!target) return null;

  return (
    <Link
      to={target.link}
      // The row itself opens the edit dialog — don't trigger it.
      onClick={(event) => event.stopPropagation()}
      className="shrink-0"
    >
      <Badge variant="outline" className="hover:bg-muted">
        {t(target.labelKey)}
      </Badge>
    </Link>
  );
};
