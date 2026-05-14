import { type SalarySettings } from "@/features/backoffice/modules/users/lib/salarySettingsSchema.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types";

import type { MeDto, PaginatedUsersDto } from "../api/dto";
import { type UserDto } from "../api/dto";
import { type Me, type User } from "../types.ts";

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
    servicesPercent: dto.services_percent,
    productsPercent: dto.products_percent,
    intakePercent: dto.intake_percent,
  };
};

export const mapMeDtoToMe = (dto: MeDto): Me => ({
  ...mapUserDtoToUser(dto),
  balance: dto.balance,
  searchPresets: dto.search_presets.map((p) => ({
    id: p.id,
    entity: p.entity,
    name: p.name,
    filters: p.filters,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  })),
});

export const mapSalarySettingsToDto = (data: SalarySettings) => ({
  services_percent: data.servicesPercent,
  products_percent: data.productsPercent,
  intake_percent: data.intakePercent,
});

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
