import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { useState } from "react";
import {
  type Control,
  type FieldErrors,
  useForm,
  type UseFormHandleSubmit,
  type UseFormRegister,
} from "react-hook-form";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import {
  outsourcersApi,
  productsApi,
  servicesApi,
  suppliersApi,
} from "@/features/backoffice/modules/dictionaries/api";
import {
  type NewOrderItemFormValues,
  type NewOrderItemSchema,
  newOrderItemSchema,
} from "@/features/backoffice/modules/orders/lib/schema.ts";
import { createNameSearchFetcher } from "@/features/backoffice/modules/orders/lib/searchFetchers.ts";
import type { OrderItemType } from "@/features/backoffice/modules/orders/types.ts";
import { usersApi } from "@/features/backoffice/modules/users/api";
import type { User } from "@/features/backoffice/modules/users/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import type { SearchableSelectOption } from "@/widgets/searchable-select";

const fetchServices = createNameSearchFetcher(servicesApi.getAll);
const fetchProducts = createNameSearchFetcher(productsApi.getAll);
const fetchSupplierItems = createNameSearchFetcher(suppliersApi.getAll);
const fetchOutsourcerItems = createNameSearchFetcher(outsourcersApi.getAll);

type UseAddOrderItemFormParams = {
  type: OrderItemType;
  initialValues?: Partial<NewOrderItemFormValues>;
  initialSupplierDisplay?: string;
  initialOutsourcerDisplay?: string;
};

type UseAddOrderItemFormReturn = {
  control: Control<NewOrderItemFormValues, unknown>;
  register: UseFormRegister<NewOrderItemFormValues>;
  handleSubmit: UseFormHandleSubmit<NewOrderItemFormValues, NewOrderItemSchema>;
  errors: FieldErrors<NewOrderItemFormValues>;
  users: User[];
  isLoadingUsers: boolean;
  fetchNameItems: (search: string) => Promise<SearchableSelectOption[]>;
  nameQueryKey: readonly unknown[];
  onCreateNameItem: (name: string) => Promise<void>;
  fetchSuppliers: (search: string) => Promise<SearchableSelectOption[]>;
  onCreateSupplier: (name: string) => Promise<SearchableSelectOption>;
  supplierDisplay: string;
  onSupplierChange: (value: string) => void;
  onSupplierSelect: (option: SearchableSelectOption) => void;
  fetchOutsourcers: (search: string) => Promise<SearchableSelectOption[]>;
  onCreateOutsourcer: (name: string) => Promise<SearchableSelectOption>;
  outsourcerDisplay: string;
  onOutsourcerChange: (value: string) => void;
  onOutsourcerSelect: (option: SearchableSelectOption) => void;
};

export const useAddOrderItemForm = ({
  type,
  initialValues,
  initialSupplierDisplay = "",
  initialOutsourcerDisplay = "",
}: UseAddOrderItemFormParams): UseAddOrderItemFormReturn => {
  const { user } = useAuth();

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => usersApi.getAll(1, 100),
  });

  const users = usersData?.items ?? [];

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<NewOrderItemFormValues, unknown, NewOrderItemSchema>({
    resolver: zodResolver(newOrderItemSchema()),
    defaultValues: initialValues ?? { quantity: 1, managerId: user?.id },
  });

  const [supplierDisplay, setSupplierDisplay] = useState(
    initialSupplierDisplay,
  );
  const [outsourcerDisplay, setOutsourcerDisplay] = useState(
    initialOutsourcerDisplay,
  );

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

  const onCreateSupplier = (name: string): Promise<SearchableSelectOption> =>
    suppliersApi.create({ name }).then((supplier) => {
      toast.success(i18next.t("orders.orderTable.successAddSupplier"));
      return { id: supplier.id, name: supplier.name };
    });

  const onSupplierChange = (value: string) => {
    setSupplierDisplay(value);
    setValue("supplierName", value);
  };

  const onSupplierSelect = (option: SearchableSelectOption) => {
    setSupplierDisplay(option.name);
    setValue("supplierName", option.name);
  };

  const onCreateOutsourcer = (name: string): Promise<SearchableSelectOption> =>
    outsourcersApi.create({ name }).then((outsourcer) => {
      toast.success(i18next.t("orders.orderTable.successAddOutsourcer"));
      return { id: outsourcer.id, name: outsourcer.name };
    });

  const onOutsourcerChange = (value: string) => {
    setOutsourcerDisplay(value);
    setValue("outsourcerName", value);
  };

  const onOutsourcerSelect = (option: SearchableSelectOption) => {
    setOutsourcerDisplay(option.name);
    setValue("outsourcerName", option.name);
  };

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
    fetchSuppliers: fetchSupplierItems,
    onCreateSupplier,
    supplierDisplay,
    onSupplierChange,
    onSupplierSelect,
    fetchOutsourcers: fetchOutsourcerItems,
    onCreateOutsourcer,
    outsourcerDisplay,
    onOutsourcerChange,
    onOutsourcerSelect,
  };
};
