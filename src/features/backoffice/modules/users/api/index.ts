import {
  type UserDto,
  UserDtoSchema,
} from "@/features/backoffice/modules/users/api/dto.ts";
import { UsersRoutes } from "@/features/backoffice/modules/users/api/routers.ts";
import { mapUserDtoToUser } from "@/features/backoffice/modules/users/lib/adapters.ts";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import { get } from "@/shared/api/api.ts";

export const usersApi = {
  getMe: async (): Promise<User> => {
    const response = await get<{ data: UserDto }>(UsersRoutes.meApi());

    const validatedData = UserDtoSchema.parse(response.data);
    return mapUserDtoToUser(validatedData);
  },
  getUsers: async (): Promise<User[]> => {
    const repo = await get<{ data: UserDto[] }>(UsersRoutes.usersApi());

    const validatedData = UserDtoSchema.array().parse(repo.data);
    return validatedData.map(mapUserDtoToUser);
  },
};
