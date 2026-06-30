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

export function mapUserDtoToUser(dto: UserDto): User {
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
}

export function mapUserDetailDtoToUserDetail(dto: UserDetailDto): UserDetail {
  return {
    ...mapUserDtoToUser(dto),
    permissions: dto.permissions,
    abilities: dto.abilities,
  };
}

export function mapMeDtoToMe(dto: MeDto): Me {
  return {
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
  };
}

export function mapPermissionDtoToPermission(dto: PermissionDto): Permission {
  return {
    id: dto.id,
    name: dto.name,
    group: dto.group,
    action: dto.action,
  };
}

export function mapRoleWithPermissionsDtoToRole(
  dto: RoleWithPermissionsDto,
): RoleWithPermissions {
  return {
    id: dto.id,
    name: dto.name,
    permissions: dto.permissions,
  };
}

export function mapSalarySettingsToDto(data: SalarySettings) {
  return {
    services_percent: data.servicesPercent,
    products_percent: data.productsPercent,
    intake_percent: data.intakePercent,
  };
}

export function mapPaginatedUsersDtoToResponse(
  dto: PaginatedUsersDto,
): PaginatedResponse<User> {
  return {
    items: dto.data.map(mapUserDtoToUser),
    meta: {
      currentPage: dto.meta.current_page,
      lastPage: dto.meta.last_page,
      total: dto.meta.total,
    },
  };
}
