import { useTranslation } from "react-i18next";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination.tsx";
import {
  Select,
  SelectContent,
  SelectItem as SelectOption,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

interface TablePaginationProps {
  page: number;
  lastPage: number;
  pageNumbers: (number | "ellipsis")[];
  perPage: number;
  perPageOptions: readonly number[];
  onPageChange: (page: number) => void;
  onPerPageChange: (value: string) => void;
}

export const TablePagination = ({
  page,
  lastPage,
  pageNumbers,
  perPage,
  perPageOptions,
  onPageChange,
  onPerPageChange,
}: TablePaginationProps) => {
  const { t } = useTranslation();

  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex-1 w-full sm:w-auto">
        {lastPage > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  label={t("table.pagination.previous")}
                  onClick={() => onPageChange(Math.max(1, page - 1))}
                  aria-disabled={page === 1}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {pageNumbers.map((p, index) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => onPageChange(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  label={t("table.pagination.next")}
                  onClick={() => onPageChange(Math.min(lastPage, page + 1))}
                  aria-disabled={page === lastPage}
                  className={
                    page === lastPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {t("table.per_page")}
        </span>
        <Select value={String(perPage)} onValueChange={onPerPageChange}>
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {perPageOptions.map((option) => (
              <SelectOption key={option} value={String(option)}>
                {option}
              </SelectOption>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
