export const sanitizeFilters = (
  filters: Record<string, string>,
  columns: { field: string; filterable?: boolean }[],
  searchField: string,
): Record<string, string> => {
  const allowed = new Set([
    searchField,
    ...columns.filter((c) => c.filterable).map((c) => c.field),
  ]);
  return Object.fromEntries(
    Object.entries(filters).filter(([key]) => allowed.has(key)),
  );
};
