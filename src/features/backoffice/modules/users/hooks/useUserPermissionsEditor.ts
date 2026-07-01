import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { usersApi } from "@/features/backoffice/modules/users/api";
import { usePermissionsSelection } from "@/features/backoffice/modules/users/hooks/usePermissionsSelection.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

import type { RoleWithPermissions } from "../types.ts";

const SAVE_DEBOUNCE_MS = 400;

type PermissionsEditorState = {
  localRoles: string[];
  localAbilities: string[];
  localPermissions: string[];
  toggleRole: (role: string) => void;
  togglePermission: (permission: string) => void;
  isAbilityFromRole: (ability: string) => boolean;
  isPending: boolean;
};

export const useUserPermissionsEditor = (
  userId: number,
  initialRoles: string[],
  initialPermissions: string[],
  rolesData: RoleWithPermissions[],
): PermissionsEditorState => {
  const queryClient = useQueryClient();
  const {
    localRoles,
    localPermissions,
    localAbilities,
    toggleRole,
    togglePermission,
    isAbilityFromRole,
  } = usePermissionsSelection(initialRoles, initialPermissions, rolesData);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRenderRef = useRef(true);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { roles: string[]; permissions: string[] }) =>
      usersApi.updateUserPermissions(userId, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.users.detail(userId), updatedUser);
    },
  });

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      mutate({ roles: localRoles, permissions: localPermissions });
      debounceTimerRef.current = null;
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [localRoles, localPermissions, mutate]);

  return {
    localRoles,
    localAbilities,
    localPermissions,
    toggleRole,
    togglePermission,
    isAbilityFromRole,
    isPending,
  };
};
