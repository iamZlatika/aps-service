import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { usersApi } from "@/features/backoffice/modules/users/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";

import type { RoleWithPermissions } from "../types.ts";

const SAVE_DEBOUNCE_MS = 400;

type MutationData = { roles: string[]; permissions: string[] };

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
  const [localRoles, setLocalRoles] = useState<string[]>(initialRoles);
  const [localPermissions, setLocalPermissions] =
    useState<string[]>(initialPermissions);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const localAbilities = useMemo(() => {
    const abilities = new Set<string>(localPermissions);
    rolesData
      .filter((r) => localRoles.includes(r.name))
      .forEach((r) => r.permissions.forEach((p) => abilities.add(p)));
    return Array.from(abilities);
  }, [localRoles, localPermissions, rolesData]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: MutationData) =>
      usersApi.updateUserPermissions(userId, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.users.detail(userId), updatedUser);
    },
  });

  const debouncedMutate = useCallback(
    (data: MutationData) => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        mutate(data);
        debounceTimerRef.current = null;
      }, SAVE_DEBOUNCE_MS);
    },
    [mutate],
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const toggleRole = (role: string): void => {
    const newRoles = localRoles.includes(role)
      ? localRoles.filter((r) => r !== role)
      : [...localRoles, role];
    setLocalRoles(newRoles);
    debouncedMutate({ roles: newRoles, permissions: localPermissions });
  };

  const togglePermission = (permission: string): void => {
    const newPermissions = localPermissions.includes(permission)
      ? localPermissions.filter((p) => p !== permission)
      : [...localPermissions, permission];
    setLocalPermissions(newPermissions);
    debouncedMutate({ roles: localRoles, permissions: newPermissions });
  };

  const isAbilityFromRole = (ability: string): boolean =>
    rolesData.some(
      (r) => localRoles.includes(r.name) && r.permissions.includes(ability),
    );

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
