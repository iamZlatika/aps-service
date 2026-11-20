import { describe, expect, it } from "vitest";

import { stockMovementSchema } from "@/features/warehouse/lib/stock.schema.ts";

describe("stockMovementSchema", () => {
  const base = { locationId: 1, quantity: "5", note: "", purchasePrice: "" };

  it("requires a note for a correction", () => {
    const result = stockMovementSchema().safeParse({
      ...base,
      reason: "correction",
      quantity: "-3",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["note"]);
  });

  it("does not require a note for purchase or write-off", () => {
    expect(
      stockMovementSchema().safeParse({ ...base, reason: "purchase" }).success,
    ).toBe(true);
    expect(
      stockMovementSchema().safeParse({ ...base, reason: "writeoff" }).success,
    ).toBe(true);
  });

  it("accepts digits only for the purchase price", () => {
    const parse = (purchasePrice: string) =>
      stockMovementSchema().safeParse({
        ...base,
        reason: "purchase",
        purchasePrice,
      });
    expect(parse("1200").success).toBe(true);
    expect(parse("-5").success).toBe(false);
    expect(parse("12.5").success).toBe(false);
  });
});
