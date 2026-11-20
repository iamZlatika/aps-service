import { describe, expect, it } from "vitest";

import {
  canSaveStoragePlace,
  getChangedMoneyValue,
  getDonorPartFormDefaults,
  getDonorSalePartRows,
  getDonorSalePurchase,
  getDonorTitle,
  getLineCostPrice,
  getSaleDocument,
  getSignedStockQuantity,
  getStoragePlaceLabel,
  getWarehouseLineSource,
  getWarehouseSourceErrorMessage,
  mapDonorFormToNewDonor,
  mapDonorSalePartRows,
  mapInvestmentFormToNew,
  mapStoragePlaceFormValues,
  parseDonorStatusFilter,
  prepareStoragePlaceList,
  toDonorStatusParam,
  toggleSource,
} from "@/features/warehouse/lib/service.ts";

describe("getSignedStockQuantity", () => {
  it("makes a purchase positive and a write-off negative", () => {
    expect(getSignedStockQuantity("purchase", 5)).toBe(5);
    expect(getSignedStockQuantity("purchase", -5)).toBe(5);
    expect(getSignedStockQuantity("writeoff", 2)).toBe(-2);
    expect(getSignedStockQuantity("writeoff", -2)).toBe(-2);
  });

  it("keeps the sign of a correction as typed", () => {
    expect(getSignedStockQuantity("correction", 3)).toBe(3);
    expect(getSignedStockQuantity("correction", -3)).toBe(-3);
  });
});

describe("getWarehouseLineSource", () => {
  it("maps showcase/supply rows to warehouse_item_id and parts to donor_part_id", () => {
    expect(getWarehouseLineSource({ source: "showcase", id: 41 })).toEqual({
      warehouseItemId: 41,
      donorPartId: null,
    });
    expect(getWarehouseLineSource({ source: "supply", id: 7 })).toEqual({
      warehouseItemId: 7,
      donorPartId: null,
    });
    expect(getWarehouseLineSource({ source: "donor_part", id: 77 })).toEqual({
      warehouseItemId: null,
      donorPartId: 77,
    });
  });
});

describe("getWarehouseSourceErrorMessage", () => {
  it("picks source errors, plain and nested", () => {
    expect(
      getWarehouseSourceErrorMessage({
        donor_part_id: ["Part already used."],
        price: ["Required."],
      }),
    ).toBe("Part already used.");
    expect(
      getWarehouseSourceErrorMessage({
        "products.1.warehouse_item_id": ["Only one source."],
      }),
    ).toBe("Only one source.");
  });

  it("returns null when there are no source errors", () => {
    expect(getWarehouseSourceErrorMessage(undefined)).toBeNull();
    expect(getWarehouseSourceErrorMessage({ price: ["Required."] })).toBeNull();
  });
});

describe("getDonorTitle", () => {
  it("joins the device data and returns null when there is none", () => {
    expect(
      getDonorTitle({
        id: 8,
        manufacturer: "Lenovo",
        deviceType: "Ноутбук",
        deviceModel: "IdeaPad 3",
      }),
    ).toBe("Lenovo Ноутбук IdeaPad 3");
    expect(
      getDonorTitle({
        id: 8,
        manufacturer: null,
        deviceType: " ",
        deviceModel: null,
      }),
    ).toBeNull();
  });
});

describe("mapDonorFormToNewDonor", () => {
  it("never sends a status — it changes only through swap / delete", () => {
    const dto = mapDonorFormToNewDonor({
      manufacturer: "Lenovo",
      deviceType: "",
      deviceModel: "IdeaPad 3",
      origin: "Купили мертвяка на OLX",
      acquisitionCost: "",
      storagePlace: { id: 2, name: "Полиця А1" },
      saveStoragePlace: false,
      locationId: 1,
      note: "",
    });
    expect(dto).not.toHaveProperty("status");
    expect(dto.origin).toBe("Купили мертвяка на OLX");
    expect(dto).not.toHaveProperty("sourceOrderId");
  });
});

describe("toggleSource", () => {
  it("adds and removes a source, keeping the canonical order", () => {
    expect(toggleSource([], "donor_part")).toEqual(["donor_part"]);
    expect(toggleSource(["donor_part"], "showcase")).toEqual([
      "showcase",
      "donor_part",
    ]);
    expect(toggleSource(["showcase", "supply"], "showcase")).toEqual([
      "supply",
    ]);
  });
});

describe("prepareStoragePlaceList", () => {
  const places = [
    { id: 1, name: "Коробка 3", locationId: 2 },
    { id: 2, name: "Стол", locationId: null },
    { id: 3, name: "Коробка 1", locationId: 1 },
    { id: 4, name: "Ящик", locationId: 1 },
  ];

  it("groups by office (no office last), then by name", () => {
    expect(
      prepareStoragePlaceList(places, undefined, "").map((p) => p.id),
    ).toEqual([3, 4, 1, 2]);
  });

  it("filters by office and name", () => {
    expect(prepareStoragePlaceList(places, "1", "").map((p) => p.id)).toEqual([
      3, 4,
    ]);
    expect(
      prepareStoragePlaceList(places, undefined, "короб").map((p) => p.id),
    ).toEqual([3, 1]);
  });
});

describe("mapStoragePlaceFormValues", () => {
  it("turns the form's strings into a place, 'none' meaning no office", () => {
    expect(
      mapStoragePlaceFormValues({ name: " Стелаж А-1 ", location_id: "1" }),
    ).toEqual({
      name: "Стелаж А-1",
      locationId: 1,
    });
    expect(
      mapStoragePlaceFormValues({ name: "Стол", location_id: "none" }),
    ).toEqual({
      name: "Стол",
      locationId: null,
    });
  });
});

describe("getChangedMoneyValue", () => {
  it("sends a changed price only", () => {
    expect(getChangedMoneyValue("1200", "1000")).toBe("1200");
    expect(getChangedMoneyValue(" 1000 ", "1000")).toBeNull();
    expect(getChangedMoneyValue("800", null)).toBe("800");
  });

  it("never clears the price with an empty field", () => {
    expect(getChangedMoneyValue("", "1000")).toBeNull();
    expect(getChangedMoneyValue("", null)).toBeNull();
  });
});

describe("getLineCostPrice", () => {
  const part = { source: "donor_part" as const, purchasePrice: "1500" };

  it("sends a donor part's cost price only when the manager changed it", () => {
    expect(getLineCostPrice(part, "1800")).toBe("1800");
    expect(getLineCostPrice(part, "1500")).toBeNull();
    expect(getLineCostPrice(part, "")).toBeNull();
    expect(getLineCostPrice({ ...part, purchasePrice: null }, "900")).toBe(
      "900",
    );
  });

  it("never sends it for a showcase / supply item", () => {
    expect(
      getLineCostPrice({ source: "showcase", purchasePrice: "100" }, "200"),
    ).toBeNull();
  });
});

describe("getStoragePlaceLabel", () => {
  it("shows the dictionary place, or the free text on the card", () => {
    expect(
      getStoragePlaceLabel({
        storagePlace: { id: 4, name: "Стелаж А-1", locationId: 1 },
        storagePlaceNote: null,
      }),
    ).toBe("Стелаж А-1");
    expect(
      getStoragePlaceLabel({
        storagePlace: null,
        storagePlaceNote: "Під столом",
      }),
    ).toBe("Під столом");
    expect(
      getStoragePlaceLabel({ storagePlace: null, storagePlaceNote: null }),
    ).toBeNull();
  });
});

describe("canSaveStoragePlace", () => {
  const places = [
    { id: 4, name: "Стелаж А-1", locationId: 1 },
    { id: 5, name: "Загальна полиця", locationId: null },
  ];

  it("offers saving only typed text that is not in the dictionary", () => {
    expect(
      canSaveStoragePlace(places, { id: null, name: "Під столом" }, 1),
    ).toBe(true);
    expect(canSaveStoragePlace(places, { id: 4, name: "Стелаж А-1" }, 1)).toBe(
      false,
    );
    expect(canSaveStoragePlace(places, { id: null, name: "  " }, 1)).toBe(
      false,
    );
  });

  it("treats the same name in the same office as existing", () => {
    expect(
      canSaveStoragePlace(places, { id: null, name: " стелаж а-1 " }, 1),
    ).toBe(false);
    // Same name, another office — a different place.
    expect(
      canSaveStoragePlace(places, { id: null, name: "Стелаж А-1" }, 2),
    ).toBe(true);
    expect(
      canSaveStoragePlace(places, { id: null, name: "Загальна полиця" }, null),
    ).toBe(false);
  });
});

describe("getDonorPartFormDefaults", () => {
  it("opens a card with a free-text place with that text typed in", () => {
    const defaults = getDonorPartFormDefaults(
      {
        id: 1,
        donor: null,
        category: { id: 11, name: "Матриця", kind: "part" },
        name: null,
        costPrice: "1500",
        isSold: false,
        soldWithDonor: false,
        soldPrice: null,
        soldInOrderId: null,
        soldInQuickOrderId: null,
        soldAt: null,
        storagePlace: null,
        storagePlaceNote: "Під столом",
        location: null,
        note: null,
        photoUrl: null,
      },
      1,
    );
    expect(defaults.storagePlace).toEqual({ id: null, name: "Під столом" });
    expect(defaults.saveStoragePlace).toBe(false);
  });
});

describe("donor status filter", () => {
  it("defaults to in stock and leaves it out of the URL", () => {
    expect(parseDonorStatusFilter(undefined)).toBe("in_stock");
    expect(parseDonorStatusFilter("bogus")).toBe("in_stock");
    expect(parseDonorStatusFilter("sold")).toBe("sold");
    expect(toDonorStatusParam("in_stock")).toBe("");
    expect(toDonorStatusParam("all")).toBe("all");
  });
});

describe("getSaleDocument", () => {
  it("points to the order or the quick sale", () => {
    const none = {
      soldInOrderId: null,
      soldInQuickOrderId: null,
      soldAt: null,
      soldPrice: null,
    };
    expect(getSaleDocument(none)).toBeNull();
    expect(getSaleDocument({ ...none, soldInOrderId: 841 })).toEqual({
      kind: "order",
      id: 841,
    });
    expect(getSaleDocument({ ...none, soldInQuickOrderId: 12 })).toEqual({
      kind: "quickOrder",
      id: 12,
    });
  });
});

describe("donor sale", () => {
  const part = {
    donor: null,
    category: { id: 11, name: "Матриця", kind: "part" as const },
    name: null,
    soldWithDonor: false,
    soldPrice: null,
    soldInOrderId: null,
    soldInQuickOrderId: null,
    soldAt: null,
    storagePlace: null,
    storagePlaceNote: null,
    location: null,
    note: null,
    photoUrl: null,
  };

  it("lists only parts on the shelf, none picked", () => {
    const rows = getDonorSalePartRows([
      { ...part, id: 3, costPrice: "1500", isSold: false },
      { ...part, id: 4, costPrice: null, isSold: true },
      { ...part, id: 5, costPrice: null, isSold: false },
    ]);
    expect(rows).toEqual([
      {
        id: 3,
        label: "Матриця",
        selected: false,
        costPrice: "1500",
        cardCostPrice: "1500",
      },
      {
        id: 5,
        label: "Матриця",
        selected: false,
        costPrice: "",
        cardCostPrice: null,
      },
    ]);
  });

  it("sends picked parts, a cost price only when edited", () => {
    expect(
      mapDonorSalePartRows([
        {
          id: 3,
          label: "",
          selected: true,
          costPrice: "1500",
          cardCostPrice: "1500",
        },
        {
          id: 5,
          label: "",
          selected: true,
          costPrice: "700",
          cardCostPrice: null,
        },
        {
          id: 6,
          label: "",
          selected: false,
          costPrice: "900",
          cardCostPrice: "900",
        },
      ]),
    ).toEqual([
      { id: 3, costPrice: null },
      { id: 5, costPrice: "700" },
    ]);
  });

  it("purchase = Σ picked cost prices, or the donor's full cost", () => {
    const rows = [
      { selected: true, costPrice: "1500" },
      { selected: true, costPrice: "2500" },
      { selected: false, costPrice: "900" },
    ];
    expect(getDonorSalePurchase(rows, "15000")).toBe("4000");
    expect(
      getDonorSalePurchase(
        rows.map((row) => ({ ...row, selected: false })),
        "15000",
      ),
    ).toBe("15000");
  });
});

describe("mapInvestmentFormToNew", () => {
  const base = {
    itemId: 44,
    itemLabel: "SSD Kingston 480GB",
    quantity: "2",
    name: "",
    amount: "",
    note: "",
  };

  it("maps a warehouse line (amount left to the backend)", () => {
    expect(mapInvestmentFormToNew({ ...base, mode: "warehouse" })).toEqual({
      warehouseItemId: 44,
      quantity: 2,
      amount: "",
      note: "",
    });
  });

  it("maps a free line without the item", () => {
    expect(
      mapInvestmentFormToNew({
        ...base,
        mode: "free",
        name: "Доставка Новою поштою",
        amount: "300",
      }),
    ).toEqual({
      warehouseItemId: null,
      name: "Доставка Новою поштою",
      amount: "300",
      note: "",
    });
  });
});
