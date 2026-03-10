import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { type DictionaryItem } from "@/features/backoffice/modules/dictionaries/models/types.ts";

export const useDictionaryActions = (
  queryKey: string[],
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
  const [editingName, setEditingName] = useState("");

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
      setEditingName("");
      return invalidate();
    },
  });

  const addItem = () => {
    const name = newItemName.trim();
    if (name) createMutation.mutate(name);
  };

  const startEdit = (item: DictionaryItem) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = () => {
    const name = editingName.trim();
    if (editingId !== null && name) {
      updateMutation.mutate({ id: editingId, name });
    }
  };

  const requestDelete = (item: DictionaryItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
    }
  };

  return {
    addModal: {
      isOpen: isAddModalOpen,
      setOpen: setIsAddModalOpen,
      value: newItemName,
      setValue: setNewItemName,
      submit: addItem,
      isPending: createMutation.isPending,
    },

    deleteModal: {
      isOpen: isDeleteModalOpen,
      setOpen: setIsDeleteModalOpen,
      item: itemToDelete,
      requestDelete,
      confirm: confirmDelete,
      isPending: deleteMutation.isPending,
    },

    editing: {
      id: editingId,
      name: editingName,
      setName: setEditingName,
      start: startEdit,
      cancel: cancelEdit,
      save: saveEdit,
      isPending: updateMutation.isPending,
    },
  };
};
