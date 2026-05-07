import type { OrderItemInitialValues } from "@/features/backoffice/modules/orders/components/info-table/types.ts";
import type {
  OrderItem,
  OrderItemType,
} from "@/features/backoffice/modules/orders/types.ts";

export function getOrderItemInitialValues(
  editItem: OrderItem,
): OrderItemInitialValues {
  const base = {
    name: editItem.name,
    price: editItem.price,
    quantity: editItem.quantity,
    managerId: editItem.manager?.id,
  };

  if (editItem.type === "product") {
    return {
      ...base,
      purchasePrice: editItem.purchasePrice ?? "",
      supplierName: editItem.supplierName ?? "",
    };
  }

  return {
    ...base,
    costPrice: editItem.costPrice ?? "",
  };
}

export function getOrderItemModalTitle(
  t: (key: string) => string,
  type: OrderItemType,
  isEdit: boolean,
): string {
  if (isEdit) {
    return type === "product"
      ? t("orders.orderTable.editProduct")
      : t("orders.orderTable.editService");
  }
  return type === "product"
    ? t("orders.orderTable.addProduct")
    : t("orders.orderTable.addService");
}
