import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { type BaseItem } from "@/shared/components/table/types.ts";

export const useTableActions = (
  queryKey: readonly (string | number | null)[],
  onAdd: (values: Partial<BaseItem>) => Promise<BaseItem>,
  onDelete: (id: number) => Promise<void>,
  onUpdate: (id: number, values: Partial<BaseItem>) => Promise<BaseItem>,
) => {
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BaseItem | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

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
    mutationFn: ({ id, values }: { id: number; values: Partial<BaseItem> }) =>
      onUpdate(id, values),
    onSuccess: () => {
      setEditingId(null);
      return invalidate();
    },
  });

  const submitAdd = useCallback(
    (values: Partial<BaseItem>) => {
      createMutation.mutate(values);
    },
    [createMutation],
  );

  const startEdit = useCallback((item: BaseItem) => {
    setEditingId(item.id);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const saveEdit = useCallback(
    (id: number, values: Partial<BaseItem>) => {
      updateMutation.mutate({ id, values });
    },
    [updateMutation],
  );

  const requestDelete = useCallback((item: BaseItem) => {
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

  const editing = useMemo(
    () => ({
      id: editingId,
      start: startEdit,
      cancel: cancelEdit,
      save: saveEdit,
      isPending: updateMutation.isPending,
    }),
    [editingId, startEdit, cancelEdit, saveEdit, updateMutation.isPending],
  );
  return { addModal, deleteModal, editing };
};
