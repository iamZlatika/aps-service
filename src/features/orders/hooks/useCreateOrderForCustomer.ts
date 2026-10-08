import { useNavigate } from "react-router-dom";

import type { Customer } from "@/features/customers/types.ts";
import { ORDERS_LINKS } from "@/features/orders/navigation.ts";
import type { Order } from "@/features/orders/types.ts";

type CustomerPrefill = Pick<Customer, "name" | "email" | "comment" | "phones">;
type DevicePrefill = Pick<
  Order,
  "deviceType" | "manufacturer" | "deviceModel" | "devicePassword"
>;

type UseCreateOrderForCustomerResult = {
  createOrderForCustomer: (customer: CustomerPrefill) => void;
  createOrderForDevice: (
    customer: CustomerPrefill,
    device: DevicePrefill,
  ) => void;
};

export const useCreateOrderForCustomer =
  (): UseCreateOrderForCustomerResult => {
    const navigate = useNavigate();

    const createOrderForCustomer = (customer: CustomerPrefill): void => {
      navigate(ORDERS_LINKS.newOrder(), { state: { customer } });
    };

    const createOrderForDevice = (
      customer: CustomerPrefill,
      { deviceType, manufacturer, deviceModel, devicePassword }: DevicePrefill,
    ): void => {
      navigate(ORDERS_LINKS.newOrder(), {
        state: {
          customer,
          device: { deviceType, manufacturer, deviceModel, devicePassword },
        },
      });
    };

    return { createOrderForCustomer, createOrderForDevice };
  };
