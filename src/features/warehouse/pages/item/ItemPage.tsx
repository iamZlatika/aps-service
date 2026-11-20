import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { ABILITIES } from "@/features/auth/abilities.ts";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { DeleteConfirmDialog } from "@/features/orders/components/info-table/DeleteConfirmDialog.tsx";
import type { QuickOrderPrefillState } from "@/features/quick-orders/lib/schema.ts";
import { QUICK_ORDERS_LINKS } from "@/features/quick-orders/navigation.ts";
import { warehouseApi } from "@/features/warehouse/api";
import { ItemFormDialog } from "@/features/warehouse/components/item-form/ItemFormDialog.tsx";
import { StockMovementDialog } from "@/features/warehouse/components/StockMovementDialog.tsx";
import { useCanManageWarehouse } from "@/features/warehouse/hooks/useCanManageWarehouse.ts";
import { useDeleteWarehouseEntity } from "@/features/warehouse/hooks/useDeleteWarehouseEntity.ts";
import { useWarehouseItem } from "@/features/warehouse/hooks/useWarehouseItem.ts";
import { isShowcaseKind } from "@/features/warehouse/lib/service.ts";
import { WAREHOUSE_LINKS } from "@/features/warehouse/navigation.ts";
import { ItemInfoCard } from "@/features/warehouse/pages/item/ItemInfoCard.tsx";
import { ItemMovementsCard } from "@/features/warehouse/pages/item/ItemMovementsCard.tsx";
import { ItemStocksCard } from "@/features/warehouse/pages/item/ItemStocksCard.tsx";
import type {
  ManualStockReason,
  WarehouseStock,
} from "@/features/warehouse/types.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";
import NotFoundPage from "@/shared/components/errors/NotFound.tsx";
import { QueryPageGuard } from "@/shared/components/errors/QueryPageGuard.tsx";
import { Button } from "@/shared/components/ui/button.tsx";

type ItemDialog =
  | { type: "edit" }
  | { type: "delete" }
  | {
      type: "movement";
      reason: ManualStockReason;
      /** null → correction, the office is picked in the form. */
      stock: WarehouseStock | null;
    }
  | null;

interface ItemPageContentProps {
  itemId: number;
}

const ItemPageContent = ({ itemId }: ItemPageContentProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, can } = useAuth();
  const canManage = useCanManageWarehouse();
  const [dialog, setDialog] = useState<ItemDialog>(null);
  const { item, isLoading, isError, error, refetch } = useWarehouseItem(itemId);
  const { onDelete } = useDeleteWarehouseEntity(warehouseApi.deleteItem, () =>
    navigate(
      item && !isShowcaseKind(item.kind)
        ? WAREHOUSE_LINKS.supplies()
        : WAREHOUSE_LINKS.showcase(),
    ),
  );

  const canSell =
    !!item && isShowcaseKind(item.kind) && can(ABILITIES.QUICK_ORDERS_MANAGE);

  const handleSell = (locationId: number) => {
    if (!item) return;
    const state: QuickOrderPrefillState = {
      locationId,
      product: {
        warehouseItemId: item.id,
        name: item.name,
        price: item.price ?? "",
        purchasePrice: item.purchasePrice ?? "",
      },
    };
    navigate(QUICK_ORDERS_LINKS.new(), { state });
  };

  return (
    <QueryPageGuard
      isLoading={isLoading}
      loadingFallback={<Loader />}
      isError={isError}
      error={error}
      onRetry={refetch}
    >
      {item && (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-2 sm:p-6 lg:max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                {t(`warehouse.kinds.${item.kind}`)}
              </p>
              <h1 className="text-lg font-bold break-words sm:text-2xl">
                {item.name}
              </h1>
            </div>
            {canManage && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialog({ type: "edit" })}
                >
                  <Pencil className="h-4 w-4" />
                  {t("warehouse.item.edit")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDialog({ type: "delete" })}
                >
                  <Trash2 className="h-4 w-4" />
                  {t("common.delete")}
                </Button>
              </div>
            )}
          </div>

          <ItemInfoCard item={item} canManage={canManage} />
          <ItemStocksCard
            item={item}
            canManage={canManage}
            canSell={canSell}
            onMovement={(reason, stock) =>
              setDialog({ type: "movement", reason, stock })
            }
            onSell={handleSell}
          />
          <ItemMovementsCard movements={item.movements} />

          {dialog?.type === "edit" && (
            <ItemFormDialog
              kind={item.kind}
              item={item}
              onClose={() => setDialog(null)}
            />
          )}
          {dialog?.type === "movement" && (
            <StockMovementDialog
              itemId={item.id}
              reason={dialog.reason}
              office={
                dialog.stock
                  ? {
                      id: dialog.stock.locationId,
                      name: dialog.stock.location.name,
                    }
                  : null
              }
              defaultLocationId={user?.location?.id ?? null}
              purchasePrice={item.purchasePrice}
              onClose={() => setDialog(null)}
            />
          )}
          <DeleteConfirmDialog
            open={dialog?.type === "delete"}
            title={t("warehouse.item.deleteTitle")}
            description={t("warehouse.item.deleteDescription")}
            onCancel={() => setDialog(null)}
            onConfirm={() => {
              setDialog(null);
              onDelete(item.id);
            }}
          />
        </div>
      )}
    </QueryPageGuard>
  );
};

const ItemPage = () => {
  const { id } = useParams<{ id: string }>();
  const itemId = id ? Number.parseInt(id, 10) : Number.NaN;

  if (!Number.isFinite(itemId)) return <NotFoundPage />;

  return <ItemPageContent itemId={itemId} />;
};

export default ItemPage;
