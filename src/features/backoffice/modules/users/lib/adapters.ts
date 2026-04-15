import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types";

import type { PaginatedUsersDto } from "../api/dto";
import { type UserDto } from "../api/dto";
import { type User } from "../types.ts";

export const mapUserDtoToUser = (dto: UserDto): User => {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    role: dto.role,
    status: dto.status,
    locale: dto.locale,
    theme: dto.theme,
    avatarUrl: dto.avatar_url,
    location: dto.location,
  };
};

export const mapPaginatedUsersDtoToResponse = (
  dto: PaginatedUsersDto,
): PaginatedResponse<User> => ({
  items: dto.data.map(mapUserDtoToUser),
  meta: {
    currentPage: dto.meta.current_page,
    lastPage: dto.meta.last_page,
    total: dto.meta.total,
  },
});
