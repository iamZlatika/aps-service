import {
  type MeDto,
  MeDtoSchema,
  PaginatedUsersDtoSchema,
  PermissionDtoSchema,
  RoleWithPermissionsDtoSchema,
  type UserDto,
  UserDetailDtoSchema,
  UserDtoSchema,
} from "@/features/backoffice/modules/users/api/dto.ts";
import { USERS_API } from "@/features/backoffice/modules/users/api/endpoints";
import {
  mapMeDtoToMe,
  mapPaginatedUsersDtoToResponse,
  mapPermissionDtoToPermission,
  mapRoleWithPermissionsDtoToRole,
  mapSalarySettingsToDto,
  mapUserDetailDtoToUserDetail,
  mapUserDtoToUser,
} from "@/features/backoffice/modules/users/lib/adapters.ts";
import { type SalarySettings } from "@/features/backoffice/modules/users/lib/salarySettingsSchema.ts";
import {
  type Me,
  type NewUser,
  type Permission,
  type RoleWithPermissions,
  type User,
  type UserDetail,
} from "@/features/backoffice/modules/users/types.ts";
import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";
import { buildPaginatedParams, get, post, put } from "@/shared/api/api.ts";
import { z } from "zod";
import { parseDto } from "@/shared/api/parseDto";
import {
  type UserLanguage,
  type UserStatus,
  type UserTheme,
} from "@/shared/types.ts";

export const usersApi = {
  getAll: async (
    page = 1,
    perPage = 20,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Record<string, string>,
  ): Promise<PaginatedResponse<User>> => {
    const params = buildPaginatedParams(
      page,
      perPage,
      sortColumn,
      sortType,
      filters,
    );
    const response = await get(`${USERS_API.listUsers()}?${params.toString()}`);
    const validated = parseDto(PaginatedUsersDtoSchema, response);
    return mapPaginatedUsersDtoToResponse(validated);
  },

  getMe: async (): Promise<Me> => {
    const response = await get<{ data: MeDto }>(USERS_API.me());
    return mapMeDtoToMe(parseDto(MeDtoSchema, response.data));
  },

  getUser: async (id: number): Promise<UserDetail> => {
    const response = await get<{ data: unknown }>(USERS_API.user(id));
    return mapUserDetailDtoToUserDetail(parseDto(UserDetailDtoSchema, response.data));
  },

  updateSalarySettings: async (
    id: number,
    data: SalarySettings,
  ): Promise<User> => {
    const response = await put<
      ReturnType<typeof mapSalarySettingsToDto>,
      { data: UserDto }
    >(USERS_API.changeUserSalarySettings(id), mapSalarySettingsToDto(data));
    const validated = parseDto(UserDtoSchema, response.data);
    return mapUserDtoToUser(validated);
  },

  updateUserStatus: async (id: number, status: UserStatus): Promise<void> => {
    await put(USERS_API.updateUserStatus(id), { status });
  },

  registerUser: async (data: NewUser): Promise<User> => {
    const response = await post<NewUser, { data: UserDto }>(
      USERS_API.registerUser(),
      data,
    );
    const validated = parseDto(UserDtoSchema, response.data);
    return mapUserDtoToUser(validated);
  },

  updateLocale: async (locale: UserLanguage): Promise<void> => {
    await put(USERS_API.updateLocale(), { locale });
  },
  updateTheme: async (theme: UserTheme): Promise<void> => {
    await put(USERS_API.updateTheme(), { theme });
  },
  updateLocation: async (
    location_id: number,
    userId: number,
  ): Promise<void> => {
    await put(USERS_API.changeUserLocation(userId), { location_id });
  },

  getPermissions: async (): Promise<Permission[]> => {
    const response = await get<{ data: unknown[] }>(USERS_API.permissions());
    return parseDto(z.array(PermissionDtoSchema), response.data).map(
      mapPermissionDtoToPermission,
    );
  },

  getRoles: async (): Promise<RoleWithPermissions[]> => {
    const response = await get<{ data: unknown[] }>(USERS_API.roles());
    return parseDto(z.array(RoleWithPermissionsDtoSchema), response.data).map(
      mapRoleWithPermissionsDtoToRole,
    );
  },

  updateRolePermissions: async (
    roleId: number,
    permissions: string[],
  ): Promise<RoleWithPermissions> => {
    const response = await put<
      { permissions: string[] },
      { data: unknown }
    >(USERS_API.updateRolePermissions(roleId), { permissions });
    return mapRoleWithPermissionsDtoToRole(
      parseDto(RoleWithPermissionsDtoSchema, response.data),
    );
  },

  updateUserPermissions: async (
    userId: number,
    data: { roles: string[]; permissions: string[] },
  ): Promise<UserDetail> => {
    const response = await put<typeof data, { data: unknown }>(
      USERS_API.updateUserPermissions(userId),
      data,
    );
    return mapUserDetailDtoToUserDetail(parseDto(UserDetailDtoSchema, response.data));
  },
};
