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
} from "@/features/backoffice/modules/customers/api/dto.ts";
import { CUSTOMERS_API } from "@/features/backoffice/modules/customers/api/endpoints";
import {
  mapCustomerDtoToCustomer,
  mapCustomerInfoDtoToCustomerInfo,
  mapNewCustomerToDto,
  mapPaginatedCustomersDtoToResponse,
  mapPhoneDtoToPhone,
  mapPhoneToPhoneDto,
  mapTelegramDtoLinkToTelegramLink,
} from "@/features/backoffice/modules/customers/lib/adapters.ts";
import {
  type Customer,
  type CustomerInfo,
  type EditedCustomer,
  type NewCustomer,
  type NewPhone,
  type Phone,
  type TelegramLink,
} from "@/features/backoffice/modules/customers/types.ts";
import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";
import { buildPaginatedParams, del, get, post, put } from "@/shared/api/api.ts";
import { type UserStatus } from "@/shared/types.ts";

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
    const validatedData = PaginatedCustomersDtoSchema.parse(response);
    return mapPaginatedCustomersDtoToResponse(validatedData);
  },
  addNewCustomer: async (data: NewCustomer): Promise<Customer> => {
    const payload = mapNewCustomerToDto(data);

    const response = await post<typeof payload, { data: CustomerDto }>(
      CUSTOMERS_API.customers(),
      payload,
    );

    const validated = CustomerDtoSchema.parse(response.data);
    return mapCustomerDtoToCustomer(validated);
  },
  getCustomer: async (id: number): Promise<CustomerInfo> => {
    const response = await get<{ data: CustomerInfoDto }>(
      `${CUSTOMERS_API.customer(id)}`,
    );
    const validatedData = CustomerInfoDtoSchema.parse(response.data);
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
    const validatedData = CustomerDtoSchema.parse(response.data);
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

    const validatedData = PhoneDtoSchema.parse(response.data);

    return mapPhoneDtoToPhone(validatedData);
  },

  changePrimaryPhone: async (
    customerId: number,
    phoneId: number,
  ): Promise<Phone[]> => {
    const response = await put<void, { data: PhoneDtoArray }>(
      CUSTOMERS_API.changePrimaryPhone(customerId, phoneId),
    );

    const validatedData = PhoneDtoArraySchema.parse(response.data);

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
    const validatedData = CustomerDtoSchema.parse(response.data);
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
    const validatedData = CustomerDtoSchema.parse(response.data);
    return mapCustomerDtoToCustomer(validatedData);
  },
  getTelegramLink: async (id: number): Promise<TelegramLink> => {
    const response = await post<void, { data: TelegramDtoLink }>(
      CUSTOMERS_API.getTelegramLink(id),
    );
    const validatedData = TelegramDtoLinkSchema.parse(response.data);
    return mapTelegramDtoLinkToTelegramLink(validatedData);
  },
  revokeTelegramLink: async (id: number): Promise<void> => {
    await del<void>(CUSTOMERS_API.revokeTelegramLink(id));
  },
};
