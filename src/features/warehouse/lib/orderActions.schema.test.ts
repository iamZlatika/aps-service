import { describe, expect, it } from "vitest";

import { donorSaleSchema } from "@/features/warehouse/lib/orderActions.schema.ts";

describe("donorSaleSchema", () => {
  const part = { id: 3, label: "Матриця", cardCostPrice: null };
  const base = { donorId: 8, donorLabel: "Lenovo IdeaPad 3", price: "5000" };

  it("requires a cost price for a picked part only", () => {
    const result = donorSaleSchema().safeParse({
      ...base,
      parts: [
        { ...part, selected: true, costPrice: "" },
        { ...part, id: 4, selected: false, costPrice: "" },
      ],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path)).toEqual([
      ["parts", 0, "costPrice"],
    ]);
  });

  it("sells the whole donor when nothing is picked", () => {
    expect(
      donorSaleSchema().safeParse({
        ...base,
        parts: [{ ...part, selected: false, costPrice: "" }],
      }).success,
    ).toBe(true);
  });

  it("requires a picked donor", () => {
    expect(
      donorSaleSchema().safeParse({ ...base, donorId: null, parts: [] })
        .success,
    ).toBe(false);
  });
});
