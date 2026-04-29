import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import {
  type Control,
  type FieldErrors,
  useForm,
  type UseFormHandleSubmit,
  type UseFormRegister,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import {
  productsApi,
  repairOperationsApi,
  suppliersApi,
} from "@/features/backoffice/modules/dictionaries/api";
import type { SearchableSelectOption } from "@/features/backoffice/modules/orders/components/searchable-select";
import {
  type NewLineItemFormValues,
  type NewLineItemSchema,
  newLineItemSchema,
} from "@/features/backoffice/modules/orders/lib/schema.ts";
import { fetchByDictionaryName } from "@/features/backoffice/modules/orders/lib/searchFetchers.ts";
import { usersApi } from "@/features/backoffice/modules/users/api";
import type { User } from "@/features/backoffice/modules/users/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const fetchRepairOperations = fetchByDictionaryName(repairOperationsApi.getAll);
const fetchProducts = fetchByDictionaryName(productsApi.getAll);
const fetchSuppliers = fetchByDictionaryName(suppliersApi.getAll);

type LineItemType = "product" | "service";

type UseAddLineItemFormParams = {
  type: LineItemType;
  initialValues?: Partial<NewLineItemFormValues>;
};

type UseAddLineItemFormReturn = {
  control: Control<NewLineItemFormValues, unknown>;
  register: UseFormRegister<NewLineItemFormValues>;
  handleSubmit: UseFormHandleSubmit<NewLineItemFormValues, NewLineItemSchema>;
  errors: FieldErrors<NewLineItemFormValues>;
  users: User[];
  isLoadingUsers: boolean;
  fetchNameItems: (search: string) => Promise<SearchableSelectOption[]>;
  nameQueryKey: readonly unknown[];
  onCreateNameItem: (name: string) => Promise<void>;
  fetchSuppliers: (search: string) => Promise<SearchableSelectOption[]>;
  onCreateSupplier: (name: string) => Promise<void>;
};

export const useAddLineItemForm = ({
  type,
  initialValues,
}: UseAddLineItemFormParams): UseAddLineItemFormReturn => {
  const { user } = useAuth();

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => usersApi.getAll(1, 100),
  });

  const users = usersData?.items ?? [];

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewLineItemFormValues, unknown, NewLineItemSchema>({
    resolver: zodResolver(newLineItemSchema()),
    defaultValues: initialValues ?? { quantity: 1, managerId: user?.id },
  });

  const selectedManagerId = useWatch({ control, name: "managerId" });
  const executorName =
    users.find((u) => u.id === selectedManagerId)?.name ?? "";

  const fetchNameItems =
    type === "service" ? fetchRepairOperations : fetchProducts;

  const nameQueryKey =
    type === "service"
      ? queryKeys.dictionaries.repairOperations()
      : queryKeys.dictionaries.products();

  const onCreateNameItem = (name: string): Promise<void> =>
    type === "service"
      ? repairOperationsApi.create({ name }).then(() => {
          toast.success(i18next.t("orders.orderTable.successAddServiceToDict"));
        })
      : productsApi.create({ name }).then(() => {
          toast.success(i18next.t("orders.orderTable.successAddProductToDict"));
        });

  const onCreateSupplier = (name: string): Promise<void> =>
    suppliersApi.create({ name, manager_name: executorName }).then(() => {
      toast.success(i18next.t("orders.orderTable.successAddSupplier"));
    });

  return {
    control,
    register,
    handleSubmit,
    errors,
    users,
    isLoadingUsers,
    fetchNameItems,
    nameQueryKey,
    onCreateNameItem,
    fetchSuppliers,
    onCreateSupplier,
  };
};
