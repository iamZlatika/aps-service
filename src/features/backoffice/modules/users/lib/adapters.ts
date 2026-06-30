import { mapLocationDtoToLocation } from "@/entities/location/adapters";
import { type SalarySettings } from "@/features/backoffice/modules/users/lib/salarySettingsSchema.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types";

import type {
  MeDto,
  PaginatedUsersDto,
  PermissionDto,
  RoleWithPermissionsDto,
  UserDetailDto,
} from "../api/dto";
import { type UserDto } from "../api/dto";
import {
  type Me,
  type Permission,
  type RoleWithPermissions,
  type User,
  type UserDetail,
} from "../types.ts";

export const mapUserDtoToUser = (dto: UserDto): User => {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    roles: dto.roles,
    status: dto.status,
    locale: dto.locale,
    theme: dto.theme,
    avatarUrl: dto.avatar_url,
    location: dto.location ? mapLocationDtoToLocation(dto.location) : null,
    servicesPercent: dto.services_percent,
    productsPercent: dto.products_percent,
    intakePercent: dto.intake_percent,
  };
};

export const mapUserDetailDtoToUserDetail = (dto: UserDetailDto): UserDetail => ({
  ...mapUserDtoToUser(dto),
  permissions: dto.permissions,
  abilities: dto.abilities,
});

export const mapMeDtoToMe = (dto: MeDto): Me => ({
  ...mapUserDtoToUser(dto),
  abilities: dto.abilities,
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

export const mapPermissionDtoToPermission = (dto: PermissionDto): Permission => ({
  id: dto.id,
  name: dto.name,
  group: dto.group,
  action: dto.action,
});

export const mapRoleWithPermissionsDtoToRole = (dto: RoleWithPermissionsDto): RoleWithPermissions => ({
  id: dto.id,
  name: dto.name,
  permissions: dto.permissions,
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
