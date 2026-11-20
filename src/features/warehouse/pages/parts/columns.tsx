import i18next from "i18next";

import { DonorTitle } from "@/features/warehouse/components/DonorTitle.tsx";
import { PhotoThumb } from "@/features/warehouse/components/PhotoThumb.tsx";
import {
  getPartDisplayName,
  getStoragePlaceLabel,
} from "@/features/warehouse/lib/service.ts";
import type { DonorPart } from "@/features/warehouse/types.ts";
import { MoneyAmount } from "@/shared/components/common/MoneyAmount.tsx";
import { type ColumnConfig } from "@/widgets/table/models/types.ts";

export function buildDonorPartColumns(): ColumnConfig<DonorPart>[] {
  return [
    {
      key: "photoUrl",
      field: "photoUrl",
      labelKey: "warehouse.table.photo",
      sortable: false,
      className: "w-14",
      renderCell: (_value, part) => (
        <PhotoThumb url={part.photoUrl} alt={getPartDisplayName(part)} />
      ),
    },
    {
      key: "name",
      field: "name",
      labelKey: "warehouse.table.name",
      sortable: true,
      renderCell: (_value, part) => getPartDisplayName(part),
    },
    {
      key: "category",
      field: "category",
      labelKey: "warehouse.table.category",
      sortable: false,
      renderCell: (_value, part) => part.category.name,
    },
    {
      key: "costPrice",
      field: "costPrice",
      labelKey: "warehouse.table.costPrice",
      sortable: false,
      renderCell: (_value, part) =>
        part.costPrice === null ? "—" : <MoneyAmount value={part.costPrice} />,
    },
    {
      key: "donor",
      field: "donor",
      labelKey: "warehouse.table.donor",
      sortable: false,
      renderCell: (_value, part) =>
        part.donor ? (
          <DonorTitle donor={part.donor} />
        ) : (
          <span className="text-muted-foreground">
            {i18next.t("warehouse.part.withoutDonor")}
          </span>
        ),
    },
    {
      key: "location",
      field: "location",
      labelKey: "warehouse.table.location",
      sortable: false,
      renderCell: (_value, part) => part.location?.name ?? "—",
    },
    {
      key: "storagePlace",
      field: "storagePlace",
      labelKey: "warehouse.table.storagePlace",
      sortable: false,
      renderCell: (_value, part) => getStoragePlaceLabel(part) ?? "—",
    },
  ];
}
