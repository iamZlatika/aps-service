import type { NewOrderItemFormValues } from "@/features/backoffice/modules/orders/lib/schema.ts";

export type OrderItemInitialData = {
  formValues: Partial<NewOrderItemFormValues>;
  supplierDisplay: string;
  outsourcerDisplay: string;
};
