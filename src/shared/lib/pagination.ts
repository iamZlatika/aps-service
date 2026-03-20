export function getPageNumbers(
  currentPage: number,
  lastPage: number,
): (number | "ellipsis")[] {
  if (lastPage <= 5) {
    return Array.from({ length: lastPage }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];

  pages.push(1);

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(lastPage - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < lastPage - 2) {
    pages.push("ellipsis");
  }
  pages.push(lastPage);

  return pages;
}
