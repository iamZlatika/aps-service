import { type Customer } from "@/features/backoffice/modules/customers/types.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";

import { type CustomerDto, type PaginatedCustomersDto } from "../api/dto";

export const mapCustomerDtoToCustomer = (dto: CustomerDto): Customer => {
  return {
    id: dto.id,
    name: dto.name,
    phones: dto.phones.map((phone) => ({
      id: phone.id,
      phoneNumber: phone.phone_number,
      phoneVerifiedAt: phone.phone_verified_at,
      isPrimary: phone.is_primary,
    })),
    email: dto.email,
    emailVerifiedAt: dto.email_verified_at,
    comment: dto.comment,
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
