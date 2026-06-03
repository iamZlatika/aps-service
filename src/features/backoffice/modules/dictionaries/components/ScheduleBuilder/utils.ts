export const DAY_INDEX: Record<string, number> = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
};

export function getUsedIndices(
  groups: { fromDay?: string; toDay?: string }[],
  excludeIndex = -1,
): Set<number> {
  const used = new Set<number>();
  groups.forEach((group, idx) => {
    if (idx === excludeIndex) return;
    const f = DAY_INDEX[group.fromDay ?? ""];
    const t = DAY_INDEX[group.toDay ?? ""];
    if (f == null || t == null) return;
    for (let i = Math.min(f, t); i <= Math.max(f, t); i++) used.add(i);
  });
  return used;
}
