import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import {
  type NewQuickOrderItemSchema,
  quickOrderPrefillStateSchema,
} from "@/features/quick-orders/lib/schema.ts";

type QuickOrderPrefill = {
  locationId: number | undefined;
  products: NewQuickOrderItemSchema[];
};

/** Reads the "Sell" hand-off from a showcase card (router state), if any. */
export const useQuickOrderPrefill = (): QuickOrderPrefill => {
  const { state } = useLocation();

  return useMemo(() => {
    const parsed = quickOrderPrefillStateSchema.safeParse(state);
    if (!parsed.success) return { locationId: undefined, products: [] };

    const { locationId, product } = parsed.data;
    return {
      locationId,
      products: [
        {
          name: product.name,
          price: product.price,
          quantity: 1,
          costPrice: "",
          purchasePrice: product.purchasePrice,
          warehouseItemId: product.warehouseItemId,
          donorPartId: null,
          warehouseDonorId: null,
          donorParts: [],
        },
      ],
    };
  }, [state]);
};
