import {
  PaginatedUsersDtoSchema,
  type UserDto,
  UserDtoSchema,
} from "@/features/backoffice/modules/users/api/dto.ts";
import { USERS_API } from "@/features/backoffice/modules/users/api/endpoints";
import {
  mapPaginatedUsersDtoToResponse,
  mapUserDtoToUser,
} from "@/features/backoffice/modules/users/lib/adapters.ts";
import {
  type NewUser,
  type User,
} from "@/features/backoffice/modules/users/types.ts";
import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";
import { get, post, put } from "@/shared/api/api.ts";
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
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });
    if (sortColumn && sortType && sortType !== "none") {
      params.set("sort_column", sortColumn);
      params.set("sort_type", sortType);
    }
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
    }
    const response = await get(`${USERS_API.listUsers()}?${params.toString()}`);
    const validated = PaginatedUsersDtoSchema.parse(response);
    return mapPaginatedUsersDtoToResponse(validated);
  },

  getMe: async (): Promise<User> => {
    const response = await get<{ data: UserDto }>(USERS_API.me());
    const validatedData = UserDtoSchema.parse(response.data);
    return mapUserDtoToUser(validatedData);
  },

  updateUserStatus: async (id: number, status: UserStatus): Promise<void> => {
    await put(USERS_API.updateUserStatus(id), { status });
  },

  registerUser: async (data: NewUser): Promise<User> => {
    const response = await post<NewUser, { data: UserDto }>(
      USERS_API.registerUser(),
      data,
    );
    const validated = UserDtoSchema.parse(response.data);
    return mapUserDtoToUser(validated);
  },

  updateLocale: async (locale: UserLanguage): Promise<void> => {
    await put(USERS_API.updateLocale(), { locale });
  },
  updateTheme: async (theme: UserTheme): Promise<void> => {
    await put(USERS_API.updateTheme(), { theme });
  },
};
