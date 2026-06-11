import { useCallback, useMemo, useRef, useState } from "react";

import type { EditOrderInfoFormValues } from "@/features/backoffice/modules/orders/lib/schema.ts";

type EditConflict = {
  blockingId: number;
  pendingId: number;
};

export type FormValuesStorage = {
  get: (id: number) => EditOrderInfoFormValues | undefined;
  set: (id: number, values: EditOrderInfoFormValues) => void;
  delete: (id: number) => void;
};

type UseOrderEditingStateReturn = {
  editingOrderIds: ReadonlySet<number>;
  formValuesStorage: FormValuesStorage;
  editConflict: EditConflict | null;
  handleStartEditing: (orderId: number) => void;
  handleStopEditing: (orderId: number) => void;
  handleConflictConfirm: () => void;
  handleConflictCancel: () => void;
};

export const useOrderEditingState = (): UseOrderEditingStateReturn => {
  const [editingOrderIds, setEditingOrderIds] = useState<ReadonlySet<number>>(
    new Set(),
  );
  const [editConflict, setEditConflict] = useState<EditConflict | null>(null);
  const savedFormValuesRef = useRef<Map<number, EditOrderInfoFormValues>>(
    new Map(),
  );

  const editingOrderIdsRef = useRef(editingOrderIds);
  editingOrderIdsRef.current = editingOrderIds;

  const formValuesStorage: FormValuesStorage = useMemo(
    () => ({
      get: (id) => savedFormValuesRef.current.get(id),
      set: (id, values) => {
        savedFormValuesRef.current.set(id, values);
      },
      delete: (id) => {
        savedFormValuesRef.current.delete(id);
      },
    }),
    [],
  );

  const handleStartEditing = useCallback((orderId: number) => {
    const conflictingId = [...editingOrderIdsRef.current].find(
      (id) => id !== orderId,
    );
    if (conflictingId !== undefined) {
      setEditConflict({ blockingId: conflictingId, pendingId: orderId });
      return;
    }
    setEditingOrderIds((prev) => new Set([...prev, orderId]));
  }, []);

  const handleStopEditing = useCallback((orderId: number) => {
    setEditingOrderIds((prev) => {
      const next = new Set(prev);
      next.delete(orderId);
      return next;
    });
  }, []);

  const handleConflictConfirm = useCallback(() => {
    if (!editConflict) return;
    formValuesStorage.delete(editConflict.blockingId);
    setEditingOrderIds((prev) => {
      const next = new Set(prev);
      next.delete(editConflict.blockingId);
      next.add(editConflict.pendingId);
      return next;
    });
    setEditConflict(null);
  }, [editConflict, formValuesStorage]);

  const handleConflictCancel = useCallback(() => {
    setEditConflict(null);
  }, []);

  return {
    editingOrderIds,
    formValuesStorage,
    editConflict,
    handleStartEditing,
    handleStopEditing,
    handleConflictConfirm,
    handleConflictCancel,
  };
};
