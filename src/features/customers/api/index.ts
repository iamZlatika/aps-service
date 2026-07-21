import {
  type CustomerDto,
  CustomerDtoSchema,
  type CustomerInfoDto,
  CustomerInfoDtoSchema,
  PaginatedCustomersDtoSchema,
  type PhoneDto,
  type PhoneDtoArray,
  PhoneDtoArraySchema,
  PhoneDtoSchema,
  type TelegramDtoLink,
  TelegramDtoLinkSchema,
} from "@/features/customers/api/dto.ts";
import { CUSTOMERS_API } from "@/features/customers/api/endpoints";
import {
  mapCustomerDtoToCustomer,
  mapCustomerInfoDtoToCustomerInfo,
  mapNewCustomerToDto,
  mapPaginatedCustomersDtoToResponse,
  mapPhoneDtoToPhone,
  mapPhoneToPhoneDto,
  mapTelegramDtoLinkToTelegramLink,
} from "@/features/customers/lib/adapters.ts";
import {
  type Customer,
  type CustomerInfo,
  type EditedCustomer,
  type NewCustomer,
  type NewPhone,
  type Phone,
  type TelegramLink,
} from "@/features/customers/types.ts";
import { buildPaginatedParams, del, get, post, put } from "@/shared/api/api.ts";
import { parseDto } from "@/shared/api/parseDto";
import { type UserStatus } from "@/shared/types.ts";
import type { SortType } from "@/widgets/table/hooks/useSortParams.ts";
import type { PaginatedResponse } from "@/widgets/table/models/types.ts";

export const customersApi = {
  getAll: async (
    page = 1,
    perPage = 20,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Record<string, string>,
  ): Promise<PaginatedResponse<Customer>> => {
    const params = buildPaginatedParams(
      page,
      perPage,
      sortColumn,
      sortType,
      filters,
    );
    const response = await get(
      `${CUSTOMERS_API.customers()}?${params.toString()}`,
    );
    const validatedData = parseDto(PaginatedCustomersDtoSchema, response);
    return mapPaginatedCustomersDtoToResponse(validatedData);
  },
  addNewCustomer: async (data: NewCustomer): Promise<Customer> => {
    const payload = mapNewCustomerToDto(data);

    const response = await post<typeof payload, { data: CustomerDto }>(
      CUSTOMERS_API.customers(),
      payload,
    );

    const validated = parseDto(CustomerDtoSchema, response.data);
    return mapCustomerDtoToCustomer(validated);
  },
  getCustomer: async (id: number): Promise<CustomerInfo> => {
    const response = await get<{ data: CustomerInfoDto }>(
      `${CUSTOMERS_API.customer(id)}`,
    );
    const validatedData = parseDto(CustomerInfoDtoSchema, response.data);
    return mapCustomerInfoDtoToCustomerInfo(validatedData);
  },
  changeCustomerStatus: async (
    id: number,
    status: UserStatus,
  ): Promise<Customer> => {
    const response = await put<{ status: UserStatus }, { data: CustomerDto }>(
      `${CUSTOMERS_API.changeStatus(id)}`,
      { status },
    );
    const validatedData = parseDto(CustomerDtoSchema, response.data);
    return mapCustomerDtoToCustomer(validatedData);
  },
  addSecondaryPhone: async (
    customerId: number,
    phone: NewPhone,
  ): Promise<Phone> => {
    const payload = mapPhoneToPhoneDto(phone);

    const response = await post<typeof payload, { data: PhoneDto }>(
      CUSTOMERS_API.addSecondaryPhone(customerId),
      payload,
    );

    const validatedData = parseDto(PhoneDtoSchema, response.data);

    return mapPhoneDtoToPhone(validatedData);
  },

  changePrimaryPhone: async (
    customerId: number,
    phoneId: number,
  ): Promise<Phone[]> => {
    const response = await put<void, { data: PhoneDtoArray }>(
      CUSTOMERS_API.changePrimaryPhone(customerId, phoneId),
    );

    const validatedData = parseDto(PhoneDtoArraySchema, response.data);

    return validatedData.map(mapPhoneDtoToPhone);
  },
  deleteSecondaryPhone: async (
    customerId: number,
    phoneId: number,
  ): Promise<void> => {
    await del<void>(CUSTOMERS_API.deleteSecondaryPhone(customerId, phoneId));
  },
  changeCustomerInfo: async (
    id: number,
    data: EditedCustomer,
  ): Promise<Customer> => {
    const response = await put<EditedCustomer, { data: CustomerDto }>(
      CUSTOMERS_API.customer(id),
      data,
    );
    const validatedData = parseDto(CustomerDtoSchema, response.data);
    return mapCustomerDtoToCustomer(validatedData);
  },
  changeCustomerRating: async (
    id: number,
    rating: number,
  ): Promise<Customer> => {
    const response = await put<{ rating: number }, { data: CustomerDto }>(
      CUSTOMERS_API.changeRating(id),
      { rating },
    );
    const validatedData = parseDto(CustomerDtoSchema, response.data);
    return mapCustomerDtoToCustomer(validatedData);
  },
  setSmsNotifications: async (
    id: number,
    enabled: boolean,
  ): Promise<Customer> => {
    const response = await put<{ enabled: boolean }, { data: CustomerDto }>(
      CUSTOMERS_API.setSmsNotifications(id),
      { enabled },
    );
    const validatedData = parseDto(CustomerDtoSchema, response.data);
    return mapCustomerDtoToCustomer(validatedData);
  },
  mergeCustomer: async (
    survivorId: number,
    absorbedCustomerId: number,
  ): Promise<CustomerInfo> => {
    const response = await post<
      { absorbed_customer_id: number },
      { data: CustomerInfoDto }
    >(CUSTOMERS_API.mergeCustomer(survivorId), {
      absorbed_customer_id: absorbedCustomerId,
    });
    const validatedData = parseDto(CustomerInfoDtoSchema, response.data);
    return mapCustomerInfoDtoToCustomerInfo(validatedData);
  },
  getTelegramLink: async (id: number): Promise<TelegramLink> => {
    const response = await post<void, { data: TelegramDtoLink }>(
      CUSTOMERS_API.getTelegramLink(id),
    );
    const validatedData = parseDto(TelegramDtoLinkSchema, response.data);
    return mapTelegramDtoLinkToTelegramLink(validatedData);
  },
  revokeTelegramLink: async (id: number): Promise<void> => {
    await del<void>(CUSTOMERS_API.revokeTelegramLink(id));
  },
};
