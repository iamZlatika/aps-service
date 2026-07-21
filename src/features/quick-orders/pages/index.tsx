import { useNavigate } from "react-router-dom";

import { ABILITIES } from "@/features/auth/abilities.ts";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { quickOrdersApi } from "@/features/quick-orders/api";
import QuickOrdersFilterBar from "@/features/quick-orders/components/QuickOrdersFilterBar.tsx";
import { QUICK_ORDERS_LINKS } from "@/features/quick-orders/navigation.ts";
import { buildQuickOrderColumns } from "@/features/quick-orders/pages/columns.tsx";
import type { QuickOrder } from "@/features/quick-orders/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { AddButton } from "@/shared/components/AddButton";
import { SmartTable } from "@/widgets/table";

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
