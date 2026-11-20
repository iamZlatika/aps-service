import i18next from "i18next";

import { DonorTitle } from "@/features/warehouse/components/DonorTitle.tsx";
import { SaleSummary } from "@/features/warehouse/components/SaleSummary.tsx";
import {
  getStoragePlaceLabel,
  isDonorSold,
} from "@/features/warehouse/lib/service.ts";
import type { Donor } from "@/features/warehouse/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { type ColumnConfig } from "@/widgets/table/models/types.ts";

export function buildDonorColumns(): ColumnConfig<Donor>[] {
  return [
    {
      key: "id",
      field: "id",
      labelKey: "warehouse.table.id",
      sortable: true,
      className: "w-16",
    },
    {
      key: "deviceModel",
      field: "deviceModel",
      labelKey: "warehouse.table.device",
      sortable: true,
      sortKey: "device_model",
      renderCell: (_value, donor) => <DonorTitle donor={donor} />,
    },
    {
      key: "status",
      field: "status",
      labelKey: "warehouse.table.status",
      sortable: false,
      renderCell: (_value, donor) =>
        isDonorSold(donor) ? (
          <span className="flex flex-col">
            <span className="font-medium">
              {i18next.t("warehouse.donorStatuses.sold")}
            </span>
            <span className="text-xs text-muted-foreground">
              <SaleSummary sale={donor} />
            </span>
          </span>
        ) : (
          i18next.t("warehouse.donorStatuses.in_stock")
        ),
    },
    {
      key: "partsCount",
      field: "partsCount",
      labelKey: "warehouse.table.partsCount",
      sortable: false,
    },
    {
      key: "location",
      field: "location",
      labelKey: "warehouse.table.location",
      sortable: false,
      renderCell: (_value, donor) => donor.location?.name ?? "—",
    },
    {
      key: "storagePlace",
      field: "storagePlace",
      labelKey: "warehouse.table.storagePlace",
      sortable: false,
      renderCell: (_value, donor) => getStoragePlaceLabel(donor) ?? "—",
    },
    {
      key: "acquisitionCost",
      field: "acquisitionCost",
      labelKey: "warehouse.donor.fields.acquisitionCost",
      sortable: false,
      renderCell: (_value, donor) =>
        donor.acquisitionCost === null ? (
          "—"
        ) : (
          <MoneyAmount value={donor.acquisitionCost} />
        ),
    },
  ];
}
