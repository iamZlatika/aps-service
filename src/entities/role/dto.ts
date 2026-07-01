import { z } from "zod";

export const PermissionDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  group: z.string(),
  action: z.string(),
});
export type PermissionDto = z.infer<typeof PermissionDtoSchema>;

export const RoleWithPermissionsDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  permissions: z.array(z.string()),
});
export type RoleWithPermissionsDto = z.infer<
  typeof RoleWithPermissionsDtoSchema
>;

export const PermissionListDtoSchema = z.array(PermissionDtoSchema);
export const RoleWithPermissionsListDtoSchema = z.array(
  RoleWithPermissionsDtoSchema,
);
