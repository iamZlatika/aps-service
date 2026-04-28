import {
  type Customer,
  type NewCustomer,
  type NewPhone,
  type Phone,
  type Telegram,
} from "@/features/backoffice/modules/customers/types.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";

import {
  type CustomerDto,
  type PaginatedCustomersDto,
  type PhoneDto,
  type TelegramDto,
} from "../api/dto";

// from dto

export const mapPhoneDtoToPhone = (phone: PhoneDto): Phone => ({
  id: phone.id,
  phoneNumber: phone.phone_number,
  phoneVerifiedAt: phone.phone_verified_at,
  isPrimary: phone.is_primary,
});
export const mapTelegramDtoToTelegram = (dto: TelegramDto): Telegram => ({
  chatId: dto.chat_id,
  linkedAt: dto.linked_at,
  activationToken: dto.activation_token,
});
export const mapCustomerDtoToCustomer = (dto: CustomerDto): Customer => {
  return {
    id: dto.id,
    name: dto.name,
    portalName: dto.portal_name,
    email: dto.email,
    emailVerifiedAt: dto.email_verified_at,
    hasGoogle: dto.has_google,
    telegram: mapTelegramDtoToTelegram(dto.telegram),
    avatarUrl: dto.avatar_url,
    phones: dto.phones.map(mapPhoneDtoToPhone),
    comment: dto.comment,
    rating: dto.rating,
    lastOrderAt: dto.last_order_at,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    status: dto.status,
  };
};

export const mapPaginatedCustomersDtoToResponse = (
  dto: PaginatedCustomersDto,
): PaginatedResponse<Customer> => ({
  items: dto.data.map(mapCustomerDtoToCustomer),
  meta: {
    currentPage: dto.meta.current_page,
    lastPage: dto.meta.last_page,
    total: dto.meta.total,
  },
});

// to dto

export const mapPhoneToPhoneDto = (phone: NewPhone) => ({
  phone_number: phone.phoneNumber,
});

export const mapNewCustomerToDto = (customer: NewCustomer) => ({
  name: customer.name,
  email: customer.email,
  comment: customer.comment,
  phone: customer.phone,
});
