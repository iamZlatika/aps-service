import { type CategoryMinPrice } from "@/features/website/types";

export function findCheapestCategory(
  keys: readonly string[],
  prices: CategoryMinPrice[],
): CategoryMinPrice | null {
  const candidates = prices.filter((p) => keys.includes(p.categoryKey));
  if (candidates.length === 0) return null;
  return candidates.reduce((min, curr) =>
    curr.minPrice < min.minPrice ? curr : min,
  );
}
