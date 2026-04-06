import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import { type UseFormSetError } from "react-hook-form";

import { type BaseItem } from "@/features/backoffice/widgets/table/models/types.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

export const useTableActions = <T extends BaseItem>(
  queryKey: readonly unknown[],
  onAdd: (values: Partial<T>) => Promise<T>,
  onDelete: (id: number) => Promise<void>,
  onUpdate: (id: number, values: Partial<T>) => Promise<T>,
) => {
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const [editDialogItem, setEditDialogItem] = useState<T | null>(null);

  const queryKeyRef = useRef(queryKey);
  queryKeyRef.current = queryKey;
  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: queryKeyRef.current }),
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
      values: Partial<T>,
      setError: UseFormSetError<Record<string, string>>,
    ) => {
      try {
        await createMutation.mutateAsync(values);
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
      values: Partial<T>,
      setError: UseFormSetError<Record<string, string>>,
    ) => {
      if (editDialogItem) {
        try {
          await updateMutation.mutateAsync({ id: editDialogItem.id, values });
        } catch (error) {
          handleFormError(error, setError);
        }
      }
    },
    [editDialogItem, updateMutation],
  );

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
      close: () => setEditDialogItem(null),
      start: startEdit,
      confirm: confirmEdit,
      isPending: updateMutation.isPending,
    }),
    [editDialogItem, startEdit, confirmEdit, updateMutation.isPending],
  );

  return { addModal, deleteModal, editModal };
};
