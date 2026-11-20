import { describe, expect, it } from "vitest";

import { mapNewProductToDto } from "@/features/orders/lib/adapters.ts";
import {
  mapNewDonorInvestmentToDto,
  mapNewDonorPartToDto,
  mapNewStockMovementToDto,
  mapNewWarehouseItemToDto,
} from "@/features/warehouse/lib/adapters.ts";

describe("mapNewWarehouseItemToDto", () => {
  const base = {
    kind: "showcase" as const,
    name: "Павербанк Baseus 20000",
    price: "1450",
    purchasePrice: "",
    supplierName: "",
    orderUrl: "",
    unit: "piece" as const,
  };

  it("sends the id of a picked category and no name", () => {
    const dto = mapNewWarehouseItemToDto({
      ...base,
      category: { id: 7, name: "Павербанк" },
    });
    expect(dto.category_id).toBe(7);
    expect(dto.category_name).toBeNull();
    expect(dto.purchase_price).toBeNull();
  });

  it("sends a typed category name to be created on the fly", () => {
    const dto = mapNewWarehouseItemToDto({
      ...base,
      category: { id: null, name: "  Павербанк " },
    });
    expect(dto.category_id).toBeNull();
    expect(dto.category_name).toBe("Павербанк");
  });

  it("no longer sends storage place or minimum quantity", () => {
    const dto = mapNewWarehouseItemToDto({
      ...base,
      category: { id: 7, name: "Павербанк" },
    });
    expect(dto).not.toHaveProperty("storage_place_id");
    expect(dto).not.toHaveProperty("min_quantity");
  });
});

describe("mapNewProductToDto (order line)", () => {
  const line = {
    name: "Павербанк Baseus 20000",
    price: "1300",
    purchasePrice: "980",
    supplierName: "Rozetka",
    quantity: 1,
    managerId: 12,
    warehouseDonorId: null,
  };

  it("does not send name / purchase price for a warehouse line", () => {
    expect(
      mapNewProductToDto({ ...line, warehouseItemId: 41, donorPartId: null }),
    ).toEqual({
      warehouse_item_id: 41,
      price: "1300",
      quantity: 1,
      manager_id: 12,
    });
    expect(
      mapNewProductToDto({ ...line, warehouseItemId: null, donorPartId: 77 }),
    ).toEqual({
      donor_part_id: 77,
      price: "1300",
      quantity: 1,
      manager_id: 12,
    });
  });

  it("sells a donor with the picked parts", () => {
    expect(
      mapNewProductToDto({
        ...line,
        warehouseItemId: null,
        donorPartId: null,
        warehouseDonorId: 8,
        donorParts: [
          { id: 3, costPrice: "1500" },
          { id: 5, costPrice: null },
        ],
        price: "5000",
      }),
    ).toEqual({
      warehouse_donor_id: 8,
      donor_parts: [{ id: 3, cost_price: "1500" }, { id: 5 }],
      price: "5000",
      quantity: 1,
      manager_id: 12,
    });
  });

  it("sells a whole donor by id — name and purchase come from its card", () => {
    expect(
      mapNewProductToDto({
        ...line,
        warehouseItemId: null,
        donorPartId: null,
        warehouseDonorId: 8,
        price: "3000",
      }),
    ).toEqual({
      warehouse_donor_id: 8,
      price: "3000",
      quantity: 1,
      manager_id: 12,
    });
  });

  it("keeps the manual line as it was", () => {
    expect(
      mapNewProductToDto({ ...line, warehouseItemId: null, donorPartId: null }),
    ).toEqual({
      name: "Павербанк Baseus 20000",
      price: "1300",
      purchase_price: "980",
      quantity: 1,
      supplier_name: "Rozetka",
      manager_id: 12,
    });
  });
});

describe("mapNewDonorPartToDto", () => {
  it("never sends donor_id — the endpoint decides the donor", () => {
    const dto = mapNewDonorPartToDto({
      category: { id: 11, name: "Матриця" },
      name: "",
      costPrice: "",
      storagePlace: { id: null, name: "Коробка 3" },
      saveStoragePlace: false,
      locationId: 1,
      note: "",
    });
    expect(dto).not.toHaveProperty("donor_id");
    expect(dto.storage_place_name).toBe("Коробка 3");
  });
});

describe("storage place → dto", () => {
  const part = {
    category: { id: 11, name: "Матриця" },
    name: "",
    costPrice: "",
    locationId: 1,
    note: "",
  };

  it("sends the save flag along with a typed name", () => {
    expect(
      mapNewDonorPartToDto({
        ...part,
        storagePlace: { id: null, name: " Під столом " },
        saveStoragePlace: false,
      }),
    ).toMatchObject({
      storage_place_id: null,
      storage_place_name: "Під столом",
      save_storage_place: false,
    });
    expect(
      mapNewDonorPartToDto({
        ...part,
        storagePlace: { id: null, name: "Стелаж А-1" },
        saveStoragePlace: true,
      }).save_storage_place,
    ).toBe(true);
  });

  it("does not send the flag for a place picked from the dictionary", () => {
    const dto = mapNewDonorPartToDto({
      ...part,
      storagePlace: { id: 4, name: "Стелаж А-1" },
      saveStoragePlace: true,
    });
    expect(dto.storage_place_id).toBe(4);
    expect(dto.storage_place_name).toBeNull();
    expect(dto).not.toHaveProperty("save_storage_place");
  });
});

describe("mapNewStockMovementToDto", () => {
  const movement = {
    locationId: 1,
    quantity: 5,
    reason: "purchase" as const,
    note: "",
  };

  it("sends a new purchase price", () => {
    expect(
      mapNewStockMovementToDto({ ...movement, purchasePrice: "1200" })
        .purchase_price,
    ).toBe("1200");
  });

  it("leaves the purchase price out when it doesn't change", () => {
    expect(
      mapNewStockMovementToDto({ ...movement, purchasePrice: null }),
    ).not.toHaveProperty("purchase_price");
  });
});

describe("mapNewDonorInvestmentToDto", () => {
  it("sends a warehouse line, with amount only when overridden", () => {
    expect(
      mapNewDonorInvestmentToDto({
        warehouseItemId: 44,
        quantity: 2,
        amount: "",
        note: "",
      }),
    ).toEqual({ warehouse_item_id: 44, quantity: 2, note: null });
    expect(
      mapNewDonorInvestmentToDto({
        warehouseItemId: 44,
        quantity: 1,
        amount: "900",
        note: "",
      }),
    ).toMatchObject({ amount: "900" });
  });

  it("sends a free line as name + amount", () => {
    expect(
      mapNewDonorInvestmentToDto({
        warehouseItemId: null,
        name: "Доставка Новою поштою",
        amount: "300",
        note: "",
      }),
    ).toEqual({ name: "Доставка Новою поштою", amount: "300", note: null });
  });
});
