import type { OrderItemInitialData } from "@/features/backoffice/modules/orders/components/info-table/types.ts";
import type {
  OrderItem,
  OrderItemType,
} from "@/features/backoffice/modules/orders/types.ts";

export function getOrderItemInitialValues(
  editItem: OrderItem,
): OrderItemInitialData {
  const base = {
    name: editItem.name,
    price: editItem.price,
    quantity: editItem.quantity,
    managerId: editItem.manager.id,
  };

  if (editItem.type === "product") {
    return {
      formValues: {
        ...base,
        purchasePrice: editItem.purchasePrice ?? "",
        supplierName: editItem.supplier?.name ?? "",
      },
      supplierDisplay: editItem.supplier?.name ?? "",
      outsourcerDisplay: "",
    };
  }

  return {
    formValues: {
      ...base,
      costPrice: editItem.costPrice ?? "",
      outsourcerName: editItem.outsourcer?.name ?? "",
    },
    supplierDisplay: "",
    outsourcerDisplay: editItem.outsourcer?.name ?? "",
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
