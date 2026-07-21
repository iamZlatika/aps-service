import { zodResolver } from "@hookform/resolvers/zod";
import i18next from "i18next";
import {
  type Control,
  type FieldErrors,
  useForm,
  type UseFormHandleSubmit,
  type UseFormRegister,
} from "react-hook-form";
import { toast } from "sonner";

import { productsApi, servicesApi } from "@/features/dictionaries/api";
import { createNameSearchFetcher } from "@/features/orders/lib/searchFetchers.ts";
import {
  type NewQuickOrderItemFormValues,
  type NewQuickOrderItemSchema,
  newQuickOrderItemSchema,
} from "@/features/quick-orders/lib/schema.ts";
import type { QuickOrderItemType } from "@/features/quick-orders/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import type { SearchableSelectOption } from "@/widgets/searchable-select";

const fetchServices = createNameSearchFetcher(servicesApi.getAll);
const fetchProducts = createNameSearchFetcher(productsApi.getAll);

type UseQuickOrderItemFormParams = {
  type: QuickOrderItemType;
  initialValues?: Partial<NewQuickOrderItemFormValues>;
};

type UseQuickOrderItemFormReturn = {
  control: Control<NewQuickOrderItemFormValues, unknown>;
  register: UseFormRegister<NewQuickOrderItemFormValues>;
  handleSubmit: UseFormHandleSubmit<
    NewQuickOrderItemFormValues,
    NewQuickOrderItemSchema
  >;
  errors: FieldErrors<NewQuickOrderItemFormValues>;
  fetchNameItems: (search: string) => Promise<SearchableSelectOption[]>;
  nameQueryKey: readonly unknown[];
  onCreateNameItem: (name: string) => Promise<void>;
};

export const useQuickOrderItemForm = ({
  type,
  initialValues,
}: UseQuickOrderItemFormParams): UseQuickOrderItemFormReturn => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewQuickOrderItemFormValues, unknown, NewQuickOrderItemSchema>({
    resolver: zodResolver(newQuickOrderItemSchema()),
    defaultValues: initialValues ?? { quantity: 1 },
  });

  const fetchNameItems = type === "service" ? fetchServices : fetchProducts;

  const nameQueryKey =
    type === "service"
      ? queryKeys.dictionaries.services()
      : queryKeys.dictionaries.products();

  const onCreateNameItem = (name: string): Promise<void> =>
    type === "service"
      ? servicesApi.create({ name }).then(() => {
          toast.success(i18next.t("orders.orderTable.successAddServiceToDict"));
        })
      : productsApi.create({ name }).then(() => {
          toast.success(i18next.t("orders.orderTable.successAddProductToDict"));
        });

  return {
    control,
    register,
    handleSubmit,
    errors,
    fetchNameItems,
    nameQueryKey,
    onCreateNameItem,
  };
};
