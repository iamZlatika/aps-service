import { useState } from "react";

import { orderStatusesApi } from "@/features/backoffice/modules/dictionaries/api";
import type { OrderStatusDto } from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import { AddButton } from "@/features/backoffice/modules/dictionaries/components/AddButton.tsx";
import { SmartTable } from "@/features/backoffice/widgets/table";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const columns: ColumnConfig<OrderStatusDto>[] = [
  {
    key: "key",
    field: "key",
    labelKey: "dictionaries.table_fields.key",
    sortable: true,
  },
  {
    key: "name_ua",
    field: "name_ua",
    labelKey: "dictionaries.table_fields.name_ua",
    sortable: false,
  },
  {
    key: "name_ru",
    field: "name_ru",
    labelKey: "dictionaries.table_fields.name_ru",
    sortable: false,
  },
  {
    key: "color",
    field: "color",
    labelKey: "dictionaries.table_fields.color",
    sortable: false,
  },
];

const OrderStatusesPage = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <>
      <SmartTable
        titleKey="breadcrumbs.orderStatuses"
        api={orderStatusesApi}
        queryKeyFn={queryKeys.dictionaries.orderStatuses}
        searchPlaceholder="search_placeholders.dictionaries_name"
        columns={columns}
        headerActions={<AddButton onClick={() => setIsAddOpen(true)} />}
      />
      {isAddOpen && <div>Add</div>}
    </>
  );
};

export default OrderStatusesPage;
