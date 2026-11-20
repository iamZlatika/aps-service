import { describe, expect, it } from "vitest";

import { mapNewQuickOrderToDto } from "@/features/quick-orders/lib/adapters.ts";

describe("mapNewQuickOrderToDto — whole donor line", () => {
  const order = {
    locationId: 1,
    paymentMethod: "cash" as const,
    services: [],
  };
  const donorLine = {
    name: "Lenovo IdeaPad 3",
    price: "20000",
    quantity: 1,
    costPrice: "",
    purchasePrice: "15000",
    warehouseItemId: null,
    donorPartId: null,
    warehouseDonorId: 8,
  };

  it("sends the donor id — no name, no purchase", () => {
    const dto = mapNewQuickOrderToDto({
      ...order,
      products: [{ ...donorLine, donorParts: [] }],
    });
    expect(dto.products).toEqual([
      { warehouse_donor_id: 8, price: "20000", quantity: 1 },
    ]);
  });

  it("sends the picked parts", () => {
    const dto = mapNewQuickOrderToDto({
      ...order,
      products: [{ ...donorLine, donorParts: [{ id: 3, costPrice: "1500" }] }],
    });
    expect(dto.products[0]).toMatchObject({
      donor_parts: [{ id: 3, cost_price: "1500" }],
    });
  });
});
