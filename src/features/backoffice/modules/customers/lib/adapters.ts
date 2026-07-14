import {
  type Customer,
  type CustomerInfo,
  type NewCustomer,
  type NewPhone,
  type Phone,
  type Telegram,
  type TelegramLink,
} from "@/features/backoffice/modules/customers/types.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";

import {
  type CustomerDto,
  type CustomerInfoDto,
  type PaginatedCustomersDto,
  type PhoneDto,
  type TelegramDto,
  type TelegramDtoLink,
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
  link: dto.link,
  qrCode: dto.qr_code,
});
export const mapCustomerDtoToCustomer = (dto: CustomerDto): Customer => ({
  id: dto.id,
  name: dto.name,
  portalName: dto.portal_name,
  email: dto.email,
  emailVerifiedAt: dto.email_verified_at,
  emailVerified: dto.email_verified ?? false,
  hasGoogle: dto.has_google,
  hasPassword: dto.has_password ?? false,
  hasVerifiedPhone: dto.has_verified_phone ?? false,
  avatarUrl: dto.avatar_url,
  phones: dto.phones.map(mapPhoneDtoToPhone).sort((a, b) => a.id - b.id),
  comment: dto.comment,
  smsNotificationsEnabled: dto.sms_notifications_enabled ?? false,
  rating: dto.rating,
  lastOrderAt: dto.last_order_at,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  status: dto.status,
});

export const mapCustomerInfoDtoToCustomerInfo = (
  dto: CustomerInfoDto,
): CustomerInfo => ({
  ...mapCustomerDtoToCustomer(dto),
  telegram: dto.telegram ? mapTelegramDtoToTelegram(dto.telegram) : null,
});

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

export const mapTelegramDtoLinkToTelegramLink = (
  dto: TelegramDtoLink,
): TelegramLink => ({
  link: dto.link,
  qrCode: dto.qr_code,
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
