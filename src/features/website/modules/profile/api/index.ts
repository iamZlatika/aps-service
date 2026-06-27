import { MeResponseDtoSchema } from "@/features/auth/website/api/dto";
import { mapCustomerDtoToCustomer } from "@/features/auth/website/lib/adapters";
import { type Customer } from "@/features/auth/website/types";
import {
  type TelegramLinkDto,
  TelegramLinkDtoSchema,
} from "@/features/website/modules/profile/api/dto";
import { CUSTOMER_PROFILE_API } from "@/features/website/modules/profile/api/endpoints";
import {
  type ChangeEmailRequestBody,
  type ChangePasswordRequestBody,
  mapTelegramLinkDtoToTelegramLink,
  type UpdateProfileNameRequestBody,
} from "@/features/website/modules/profile/lib/adapters";
import { type TelegramLink } from "@/features/website/modules/profile/types";
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
  setPrimaryPhone: async (phone: string): Promise<Customer> => {
    const response = await put<{ phone: string }, unknown>(
      CUSTOMER_PROFILE_API.primaryPhone(),
      { phone },
    );
    const validated = parseDto(MeResponseDtoSchema, response);
    return mapCustomerDtoToCustomer(validated.data);
  },
  addPhone: async (phone: string): Promise<Customer> => {
    const response = await post<{ phone: string }, unknown>(
      CUSTOMER_PROFILE_API.phones(),
      { phone },
    );
    const validated = parseDto(MeResponseDtoSchema, response);
    return mapCustomerDtoToCustomer(validated.data);
  },
  deletePhone: async (id: number): Promise<void> => {
    await del(CUSTOMER_PROFILE_API.phoneById(id));
  },
  generateTelegramLink: async (): Promise<TelegramLink> => {
    const response = await post<void, { data: TelegramLinkDto }>(
      CUSTOMER_PROFILE_API.generateTelegramLink(),
    );
    const validated = parseDto(TelegramLinkDtoSchema, response.data);
    return mapTelegramLinkDtoToTelegramLink(validated);
  },
  revokeTelegramLink: async (): Promise<void> => {
    await del(CUSTOMER_PROFILE_API.revokeTelegramLink());
  },
};
