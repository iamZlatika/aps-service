import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, ArrowUpDown, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { DictionaryApi } from "@/features/backoffice/modules/dictionaries/api/createDictionaryApi.ts";
import { TableContent } from "@/features/backoffice/modules/dictionaries/components/table/TableContent.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
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
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table.tsx";
import { type PerPageOption, usePerPage } from "@/shared/hooks/usePerPage.ts";
import { type SortType, useSortParams } from "@/shared/hooks/useSortParams.ts";
import { getPageNumbers } from "@/shared/lib/pagination.ts";

import { AddItemDialog, DeleteConfirmDialog } from "./dialogs";
import { useDictionaryActions } from "./hooks/useDictionaryActions";

interface DictionaryTableProps {
  titleKey: string;
  api: DictionaryApi;
  queryKeyFn: (
    page: number,
    perPage: number,
    sortColumn: string | null,
    sortType: SortType,
  ) => readonly (string | number | null)[];
}

export const DictionaryTable = ({
  titleKey,
  api,
  queryKeyFn,
}: DictionaryTableProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { perPage, setPerPage, perPageOptions } = usePerPage();
  const { sort, toggleSort } = useSortParams();

  const queryKey = queryKeyFn(page, perPage, sort.column, sort.type);

  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: () => api.getAll(page, perPage, sort.column, sort.type),
  });

  const { addModal, deleteModal, editing } = useDictionaryActions(
    queryKey,
    (name) => api.create({ name }),
    (id) => api.remove(id),
    (id, name) => api.update(id, { name }),
  );

  const isOperationLoading =
    isLoading ||
    isFetching ||
    addModal.isPending ||
    deleteModal.isPending ||
    editing.isPending;

  const items = data?.items;
  const meta = data?.meta;
  const lastPage = meta?.lastPage ?? 1;
  const pageNumbers = getPageNumbers(page, lastPage);

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value) as PerPageOption);
    setPage(1);
  };

  return (
    <div className="p-2 sm:p-6 max-w-4xl mx-auto w-full">
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold">{t(titleKey)}</h1>

        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => addModal.setOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("sidebar.dictionaries_list.table.add_button")}
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center gap-1">
                  {sort.column === "name" && sort.type === "asc" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : sort.column === "name" && sort.type === "desc" ? (
                    <ArrowDown className="h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  )}
                  {t("sidebar.dictionaries_list.table.name")}
                </div>
              </TableHead>
              <TableHead className="w-[80px] sm:w-[100px] text-right"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableContent
              items={items}
              isOperationLoading={isOperationLoading}
              editingId={editing.id}
              updatePending={editing.isPending}
              perPage={perPage}
              onSave={editing.save}
              onCancel={editing.cancel}
              onEdit={editing.start}
              onDelete={deleteModal.requestDelete}
            />
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex-1 w-full sm:w-auto">
          {lastPage > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    label={t(
                      "sidebar.dictionaries_list.table.pagination.previous",
                    )}
                    onClick={() => setPage(Math.max(1, page - 1))}
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
                        onClick={() => setPage(p)}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    label={t("sidebar.dictionaries_list.table.pagination.next")}
                    onClick={() => setPage(Math.min(lastPage, page + 1))}
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
            {t("sidebar.dictionaries_list.table.per_page")}
          </span>
          <Select value={String(perPage)} onValueChange={handlePerPageChange}>
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

      <AddItemDialog
        isOpen={addModal.isOpen}
        onOpenChange={addModal.setOpen}
        title={t("sidebar.dictionaries_list.table.add_modal.title")}
        placeholder={t(
          "sidebar.dictionaries_list.table.add_modal.input_placeholder",
        )}
        cancelLabel={t("sidebar.dictionaries_list.table.add_modal.cancel")}
        confirmLabel={t("sidebar.dictionaries_list.table.add_modal.add")}
        onConfirm={addModal.submit}
        isPending={addModal.isPending}
        value={addModal.value}
        onValueChange={addModal.setValue}
      />

      <DeleteConfirmDialog
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.setOpen}
        title={t("sidebar.dictionaries_list.table.delete_modal.title")}
        description={t(
          "sidebar.dictionaries_list.table.delete_modal.description",
          {
            name: deleteModal.item?.name,
          },
        )}
        cancelLabel={t("sidebar.dictionaries_list.table.delete_modal.cancel")}
        confirmLabel={t("sidebar.dictionaries_list.table.delete_modal.confirm")}
        onConfirm={deleteModal.confirm}
        isPending={deleteModal.isPending}
      />
    </div>
  );
};
