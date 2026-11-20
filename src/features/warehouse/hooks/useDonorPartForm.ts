import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { warehouseApi } from "@/features/warehouse/api";
import {
  type DonorPartFormValues,
  type DonorPartSchema,
  donorPartSchema,
} from "@/features/warehouse/lib/part.schema.ts";
import {
  getDonorPartFormDefaults,
  mapDonorPartFormToNewPart,
} from "@/features/warehouse/lib/service.ts";
import type { DonorPart } from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

const FIELD_MAP = {
  category_id: "category",
  category_name: "category",
  cost_price: "costPrice",
  storage_place_id: "storagePlace",
  storage_place_name: "storagePlace",
  save_storage_place: "storagePlace",
  location_id: "locationId",
} as const;

type UseDonorPartFormParams = {
  part?: DonorPart;
  /** For a new part: attach to this donor, or null for a standalone part. */
  donorId: number | null;
  defaultLocationId: number | null;
  onSuccess: () => void;
};

type UseDonorPartFormReturn = {
  methods: UseFormReturn<DonorPartFormValues, unknown, DonorPartSchema>;
  onSubmit: (values: DonorPartSchema) => void;
  isPending: boolean;
};

export const useDonorPartForm = ({
  part,
  donorId,
  defaultLocationId,
  onSuccess,
}: UseDonorPartFormParams): UseDonorPartFormReturn => {
  const queryClient = useQueryClient();

  const methods = useForm<DonorPartFormValues, unknown, DonorPartSchema>({
    resolver: zodResolver(donorPartSchema()),
    defaultValues: getDonorPartFormDefaults(part, defaultLocationId),
  });

  const mutation = useMutation({
    mutationFn: (values: DonorPartSchema) => {
      const payload = mapDonorPartFormToNewPart(values);
      return part
        ? warehouseApi.updatePart(part.id, payload)
        : warehouseApi.createPart(payload, donorId);
    },
    onSuccess: () => {
      toast.success(
        i18next.t(
          part
            ? "warehouse.part.successUpdate"
            : "warehouse.part.successCreate",
        ),
      );
      void queryClient.invalidateQueries({ queryKey: queryKeys.warehouse.all });
      onSuccess();
    },
    onError: (error) => {
      if (isApiError(error) && error.status === 422) {
        handleFormError(error, methods.setError, { fieldMap: FIELD_MAP });
      } else {
        notifyError(error);
      }
    },
  });

  return {
    methods,
    onSubmit: mutation.mutate,
    isPending: mutation.isPending,
  };
};
