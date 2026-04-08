import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import { type UseFormSetError } from "react-hook-form";

import { type BaseItem } from "@/features/backoffice/widgets/table/models/types.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

export const useTableActions = <T extends BaseItem>(
  queryKeyFn: () => readonly unknown[],
  onAdd: (values: Partial<T>) => Promise<T>,
  onDelete: (id: number) => Promise<void>,
  onUpdate: (id: number, values: Partial<T>) => Promise<T>,
) => {
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const [editDialogItem, setEditDialogItem] = useState<T | null>(null);

  const queryKeyFnRef = useRef(queryKeyFn);
  queryKeyFnRef.current = queryKeyFn;
  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: queryKeyFnRef.current() }),
    [queryClient],
  );

  const createMutation = useMutation({
    mutationFn: onAdd,
    onSuccess: () => {
      setIsAddModalOpen(false);
      return invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: onDelete,
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      return invalidate();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: Partial<T> }) =>
      onUpdate(id, values),
    onSuccess: () => {
      setEditDialogItem(null);
      return invalidate();
    },
  });

  const submitAdd = useCallback(
    async (
      values: Record<string, unknown>,
      setError: UseFormSetError<Record<string, string>>,
    ) => {
      try {
        await createMutation.mutateAsync(values as Partial<T>);
      } catch (error) {
        handleFormError(error, setError);
      }
    },
    [createMutation],
  );

  const startEdit = useCallback((item: T) => {
    setEditDialogItem(item);
  }, []);

  const confirmEdit = useCallback(
    async (
      values: Record<string, unknown>,
      setError: UseFormSetError<Record<string, string>>,
    ) => {
      if (editDialogItem) {
        try {
          await updateMutation.mutateAsync({
            id: editDialogItem.id,
            values: values as Partial<T>,
          });
        } catch (error) {
          handleFormError(error, setError);
        }
      }
    },
    [editDialogItem, updateMutation],
  );

  const closeEdit = useCallback(() => {
    setEditDialogItem(null);
  }, []);

  const requestDelete = useCallback((item: T) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
    }
  }, [itemToDelete, deleteMutation]);

  const addModal = useMemo(
    () => ({
      isOpen: isAddModalOpen,
      setOpen: setIsAddModalOpen,
      submit: submitAdd,
      isPending: createMutation.isPending,
    }),
    [isAddModalOpen, submitAdd, createMutation.isPending],
  );

  const deleteModal = useMemo(
    () => ({
      isOpen: isDeleteModalOpen,
      setOpen: setIsDeleteModalOpen,
      item: itemToDelete,
      requestDelete,
      confirm: confirmDelete,
      isPending: deleteMutation.isPending,
    }),
    [
      isDeleteModalOpen,
      itemToDelete,
      requestDelete,
      confirmDelete,
      deleteMutation.isPending,
    ],
  );

  const editModal = useMemo(
    () => ({
      item: editDialogItem,
      isOpen: editDialogItem !== null,
      close: closeEdit,
      start: startEdit,
      confirm: confirmEdit,
      isPending: updateMutation.isPending,
    }),
    [
      editDialogItem,
      closeEdit,
      startEdit,
      confirmEdit,
      updateMutation.isPending,
    ],
  );

  return { addModal, deleteModal, editModal };
};
