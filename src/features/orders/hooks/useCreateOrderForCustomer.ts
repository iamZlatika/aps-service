import { useNavigate } from "react-router-dom";

import type { Customer } from "@/features/customers/types.ts";
import { ORDERS_LINKS } from "@/features/orders/navigation.ts";

type CustomerPrefill = Pick<Customer, "name" | "email" | "comment" | "phones">;

export const useCreateOrderForCustomer = () => {
  const navigate = useNavigate();

  const createOrderForCustomer = (customer: CustomerPrefill): void => {
    navigate(ORDERS_LINKS.newOrder(), { state: { customer } });
  };

  return { createOrderForCustomer };
};
