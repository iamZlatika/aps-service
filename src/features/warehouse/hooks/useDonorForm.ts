import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { warehouseApi } from "@/features/warehouse/api";
import {
  type DonorFormValues,
  type DonorSchema,
  donorSchema,
} from "@/features/warehouse/lib/donor.schema.ts";
import {
  getDonorFormDefaults,
  mapDonorFormToNewDonor,
} from "@/features/warehouse/lib/service.ts";
import type { Donor, DonorDetail } from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";
import { isApiError, notifyError } from "@/shared/lib/errors/services.ts";

const FIELD_MAP = {
  device_type: "deviceType",
  device_model: "deviceModel",
  origin: "origin",
  acquisition_cost: "acquisitionCost",
  storage_place_id: "storagePlace",
  storage_place_name: "storagePlace",
  save_storage_place: "storagePlace",
  location_id: "locationId",
} as const;

type UseDonorFormParams = {
  donor?: Donor;
  defaultLocationId: number | null;
  onSuccess: (donor: DonorDetail) => void;
};

type UseDonorFormReturn = {
  methods: UseFormReturn<DonorFormValues, unknown, DonorSchema>;
  onSubmit: (values: DonorSchema) => void;
  isPending: boolean;
};

export const useDonorForm = ({
  donor,
  defaultLocationId,
  onSuccess,
}: UseDonorFormParams): UseDonorFormReturn => {
  const queryClient = useQueryClient();

  const methods = useForm<DonorFormValues, unknown, DonorSchema>({
    resolver: zodResolver(donorSchema()),
    defaultValues: getDonorFormDefaults(donor, defaultLocationId),
  });

  const mutation = useMutation({
    mutationFn: (values: DonorSchema) => {
      const payload = mapDonorFormToNewDonor(values, donor);
      return donor
        ? warehouseApi.updateDonor(donor.id, payload)
        : warehouseApi.createDonor(payload);
    },
    onSuccess: (saved) => {
      toast.success(
        i18next.t(
          donor
            ? "warehouse.donor.successUpdate"
            : "warehouse.donor.successCreate",
        ),
      );
      // The donor shows in lists, the picker and its parts — refresh them all.
      void queryClient.invalidateQueries({ queryKey: queryKeys.warehouse.all });
      onSuccess(saved);
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
