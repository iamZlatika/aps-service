import {
  type UserDto,
  UserDtoSchema,
} from "@/features/backoffice/modules/users/api/dto.ts";
import { mapUserDtoToUser } from "@/features/backoffice/modules/users/lib/adapters.ts";
import { type User } from "@/features/backoffice/modules/users/types.ts";
import { del, post } from "@/shared/api/api.ts";

import { PROFILE_API } from "./endpoints.ts";

export const profileApi = {
  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await post<FormData, { data: UserDto }>(
      PROFILE_API.avatar(),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    const validatedData = UserDtoSchema.parse(response.data);
    return mapUserDtoToUser(validatedData);
  },

  deleteAvatar: async (): Promise<User> => {
    const response = await del<{ data: UserDto }>(PROFILE_API.avatar());

    const validatedData = UserDtoSchema.parse(response.data);
    return mapUserDtoToUser(validatedData);
  },
};
