import type { OrderLineItem } from "@/features/backoffice/modules/orders/types.ts";

export type ModalState =
  | { mode: "add"; type: "product" | "service" }
  | { mode: "edit"; item: OrderLineItem }
  | null;
