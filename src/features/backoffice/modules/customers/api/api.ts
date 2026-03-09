import {
  type CustomerDto,
  CustomerDtoSchema,
} from "@/features/backoffice/modules/customers/api/dto.ts";
import { CustomersRoutes } from "@/features/backoffice/modules/customers/api/routers.ts";
import { mapCustomerDtoToCustomer } from "@/features/backoffice/modules/customers/lib/adapters.ts";
import { type Customer } from "@/features/backoffice/modules/customers/model/types.ts";
import { get } from "@/shared/api/apiClient.ts";

export const customersApi = {
  getCustomers: async (): Promise<Customer[]> => {
    const repo = await get<{ data: CustomerDto[] }>(
      CustomersRoutes.customersApi(),
    );

    const validatedData = CustomerDtoSchema.array().parse(repo.data);
    return validatedData.map(mapCustomerDtoToCustomer);
  },
};
