import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { locationApi } from "@/features/backoffice/modules/dictionaries/api";
import {
  LocationFormSchema,
  type LocationFormValues,
} from "@/features/backoffice/modules/dictionaries/lib/location.schema.ts";
import {
  mapScheduleGroupsToSchedule,
  mapScheduleToGroups,
} from "@/features/backoffice/modules/dictionaries/lib/schedule.service.ts";
import type { Location } from "@/features/backoffice/modules/dictionaries/types.ts";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

export const useLocationForm = (
  location: Location | null,
  isOpen: boolean,
  onSuccess: () => void,
) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(LocationFormSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      scheduleGroups: [],
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    reset(
      location
        ? {
            name: location.name,
            address: location.address,
            phone: location.phone,
            scheduleGroups: mapScheduleToGroups(location.schedule),
          }
        : { name: "", address: "", phone: "", scheduleGroups: [] },
    );
  }, [isOpen, location, reset]);

  const mutation = useMutation({
    mutationFn: async (values: LocationFormValues) => {
      const schedule =
        values.scheduleGroups.length > 0
          ? mapScheduleGroupsToSchedule(values.scheduleGroups)
          : null;
      const payload = {
        name: values.name,
        address: values.address,
        phone: values.phone,
        schedule,
      };
      if (location) {
        return locationApi.update(location.id, payload);
      }
      return locationApi.create(payload);
    },
    onSuccess,
    onError: (error) => handleFormError(error, setError),
  });

  return {
    register,
    control,
    getValues,
    trigger,
    errors,
    isPending: mutation.isPending,
    onSubmit: handleSubmit((values) => mutation.mutate(values)),
  };
};
