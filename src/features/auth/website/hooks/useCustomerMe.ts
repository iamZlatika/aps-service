import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";

import { websiteAuthApi } from "@/features/auth/website/api";
import { type Customer } from "@/features/auth/website/types";
import { queryKeys } from "@/shared/api/queryKeys";

export const useCustomerMe = (): UseSuspenseQueryResult<Customer> =>
  useSuspenseQuery({
    queryKey: queryKeys.auth.customer(),
    queryFn: websiteAuthApi.me,
  });
