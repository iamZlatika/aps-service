import { z } from "zod";

import { LocationDtoSchema } from "@/entities/location/dto";
import { emailRegex } from "@/shared/lib/constants.ts";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";
import {
  USER_LANGUAGES,
  USER_STATUSES,
  USER_THEMES,
} from "@/shared/types.ts";

export const UserDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().regex(emailRegex),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
  status: zodEnumFromConst(USER_STATUSES),
  locale: zodEnumFromConst(USER_LANGUAGES),
  theme: zodEnumFromConst(USER_THEMES),
  avatar_url: z.string(),
  location: LocationDtoSchema.nullable(),
  services_percent: z.number(),
  products_percent: z.number(),
  intake_percent: z.number(),
});
export type UserDto = z.infer<typeof UserDtoSchema>;

export const SearchPresetFiltersDtoSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  sort_type: z.string(),
  sort_column: z.string().optional(),
  status_ids: z.array(z.number()).optional(),
  manager_id: z.number().optional(),
  location_id: z.number().optional(),
  is_urgent: z.number().optional(),
  any_match: z.string().optional(),
});
export type SearchPresetFiltersDto = z.infer<
  typeof SearchPresetFiltersDtoSchema
>;

export const SearchPresetDtoSchema = z.object({
  id: z.number(),
  entity: z.string(),
  name: z.string(),
  filters: SearchPresetFiltersDtoSchema,
  created_at: z.string(),
  updated_at: z.string(),
});
export type SearchPresetDto = z.infer<typeof SearchPresetDtoSchema>;

export const MeDtoSchema = UserDtoSchema.extend({
  abilities: z.array(z.string()),
  balance: z.string(),
  search_presets: z.array(SearchPresetDtoSchema),
});
export type MeDto = z.infer<typeof MeDtoSchema>;

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
export type RoleWithPermissionsDto = z.infer<typeof RoleWithPermissionsDtoSchema>;

export const PaginatedUsersDtoSchema = z.object({
  data: z.array(UserDtoSchema),
  meta: z.object({
    current_page: z.number(),
    last_page: z.number(),
    total: z.number(),
    per_page: z.number(),
    from: z.number().nullable(),
    to: z.number().nullable(),
  }),
});

export type PaginatedUsersDto = z.infer<typeof PaginatedUsersDtoSchema>;
