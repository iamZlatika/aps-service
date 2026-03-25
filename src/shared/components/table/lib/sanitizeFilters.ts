export const sanitizeFilters = (
  filters: Record<string, string>,
  columns: { key: string; filterable?: boolean }[],
  searchField: string,
): Record<string, string> => {
  const allowed = new Set([
    searchField,
    ...columns.filter((c) => c.filterable).map((c) => c.key),
  ]);
  return Object.fromEntries(
    Object.entries(filters).filter(([key]) => allowed.has(key)),
  );
};
