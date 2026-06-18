import { MeResponseDtoSchema } from "@/features/auth/website/api/dto";
import { mapCustomerDtoToCustomer } from "@/features/auth/website/lib/adapters";
import { type Customer } from "@/features/auth/website/types";
import { CUSTOMER_PROFILE_API } from "@/features/website/modules/profile/api/endpoints";
import {
  type ChangeEmailRequestBody,
  type ChangePasswordRequestBody,
  type UpdateProfileNameRequestBody,
} from "@/features/website/modules/profile/lib/adapters";
import { del, post, put } from "@/shared/api/api";
import { parseDto } from "@/shared/api/parseDto";

export const customerProfileApi = {
  updateName: async (body: UpdateProfileNameRequestBody): Promise<Customer> => {
    const response = await put<UpdateProfileNameRequestBody, unknown>(
      CUSTOMER_PROFILE_API.update(),
      body,
    );
    const validated = parseDto(MeResponseDtoSchema, response);
    return mapCustomerDtoToCustomer(validated.data);
  },
  uploadAvatar: async (file: File): Promise<Customer> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await post<FormData, unknown>(
      CUSTOMER_PROFILE_API.avatar(),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    const validated = parseDto(MeResponseDtoSchema, response);
    return mapCustomerDtoToCustomer(validated.data);
  },
  deleteAvatar: async (): Promise<void> => {
    await del(CUSTOMER_PROFILE_API.avatar());
  },
  changePassword: async (body: ChangePasswordRequestBody): Promise<void> => {
    await post(CUSTOMER_PROFILE_API.changePassword(), body);
  },
  changeEmail: async (body: ChangeEmailRequestBody): Promise<void> => {
    await post(CUSTOMER_PROFILE_API.changeEmail(), body);
  },
};
