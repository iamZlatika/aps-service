import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { type DictionaryItem } from "@/features/backoffice/modules/dictionaries/types.ts";

export const useDictionaryActions = (
  queryKey: readonly string[],
  onAdd: (name: string) => Promise<DictionaryItem>,
  onDelete: (id: number) => Promise<void>,
  onUpdate: (id: number, name: string) => Promise<DictionaryItem>,
) => {
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DictionaryItem | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const createMutation = useMutation({
    mutationFn: onAdd,
    onSuccess: () => {
      setIsAddModalOpen(false);
      setNewItemName("");
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
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      onUpdate(id, name),
    onSuccess: () => {
      setEditingId(null);
      return invalidate();
    },
  });

  const addItem = useCallback(() => {
    const name = newItemName.trim();
    if (name) createMutation.mutate(name);
  }, [newItemName, createMutation]);

  const startEdit = useCallback((item: DictionaryItem) => {
    setEditingId(item.id);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const saveEdit = useCallback(
    (id: number, name: string) => {
      updateMutation.mutate({ id, name });
    },
    [updateMutation],
  );

  const requestDelete = useCallback((item: DictionaryItem) => {
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
      value: newItemName,
      setValue: setNewItemName,
      submit: addItem,
      isPending: createMutation.isPending,
    }),
    [isAddModalOpen, newItemName, addItem, createMutation.isPending],
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
