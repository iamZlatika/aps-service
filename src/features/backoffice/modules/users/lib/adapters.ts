import { type UserDto } from "../api/dto";
import { type User } from "../types.ts";

export const mapUserDtoToUser = (dto: UserDto): User => {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    role: dto.role,
    status: dto.status,
    avatarUrl: dto.avatar_url,
  };
};
