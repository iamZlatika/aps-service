import {
  type CustomerDto,
  CustomerDtoSchema,
  PaginatedCustomersDtoSchema,
} from "@/features/backoffice/modules/customers/api/dto.ts";
import { CUSTOMERS_API } from "@/features/backoffice/modules/customers/api/endpoints";
import {
  mapCustomerDtoToCustomer,
  mapPaginatedCustomersDtoToResponse,
} from "@/features/backoffice/modules/customers/lib/adapters.ts";
import {
  type Customer,
  type NewCustomer,
} from "@/features/backoffice/modules/customers/types.ts";
import type { SortType } from "@/features/backoffice/widgets/table/hooks/useSortParams.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";
import { get, post } from "@/shared/api/api.ts";

export const customersApi = {
  getAll: async (
    page = 1,
    perPage = 20,
    sortColumn?: string | null,
    sortType?: SortType,
    filters?: Record<string, string>,
  ): Promise<PaginatedResponse<Customer>> => {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });
    if (sortColumn && sortType && sortType !== "none") {
      params.set("sort_column", sortColumn);
      params.set("sort_type", sortType);
    }
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
    }
    const response = await get(
      `${CUSTOMERS_API.customers()}?${params.toString()}`,
    );
    const validatedData = PaginatedCustomersDtoSchema.parse(response);
    return mapPaginatedCustomersDtoToResponse(validatedData);
  },
  addNewCustomer: async (data: NewCustomer): Promise<Customer> => {
    const response = await post<NewCustomer, { data: CustomerDto }>(
      CUSTOMERS_API.customers(),
      data,
    );
    const validated = CustomerDtoSchema.parse(response.data);
    return mapCustomerDtoToCustomer(validated);
  },
};
