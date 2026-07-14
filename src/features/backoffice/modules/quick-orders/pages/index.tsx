import { useNavigate } from "react-router-dom";

import { ABILITIES } from "@/features/auth/backoffice/abilities.ts";
import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { AddButton } from "@/features/backoffice/components/AddButton";
import { quickOrdersApi } from "@/features/backoffice/modules/quick-orders/api";
import QuickOrdersFilterBar from "@/features/backoffice/modules/quick-orders/components/QuickOrdersFilterBar.tsx";
import { QUICK_ORDERS_LINKS } from "@/features/backoffice/modules/quick-orders/navigation.ts";
import { buildQuickOrderColumns } from "@/features/backoffice/modules/quick-orders/pages/columns.tsx";
import type { QuickOrder } from "@/features/backoffice/modules/quick-orders/types.ts";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const columns = buildQuickOrderColumns();

const QuickOrdersPage = () => {
  const navigate = useNavigate();
  const { can } = useAuth();
  const canManage = can(ABILITIES.QUICK_ORDERS_MANAGE);

  const onRowClick = (quickOrder: QuickOrder) =>
    navigate(QUICK_ORDERS_LINKS.detail(quickOrder.id));

  return (
    <SmartTable
      titleKey="breadcrumbs.quickOrders"
      api={quickOrdersApi}
      queryKeyFn={queryKeys.quickOrders.list}
      searchPlaceholder="search_placeholders.quick_orders_number"
      searchField="search"
      columns={columns}
      filterBar={<QuickOrdersFilterBar />}
      extraFilterKeys={["manager_id"]}
      onRowClick={onRowClick}
      headerActions={
        canManage ? (
          <AddButton onClick={() => navigate(QUICK_ORDERS_LINKS.new())} />
        ) : undefined
      }
    />
  );
};

export default QuickOrdersPage;
