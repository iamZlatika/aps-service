import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { Location } from "@/entities/location/types";
import { locationApi } from "@/features/dictionaries/api";
import {
  LocationFormSchema,
  type LocationFormValues,
} from "@/features/dictionaries/lib/location.schema.ts";
import {
  mapScheduleGroupsToSchedule,
  mapScheduleToGroups,
} from "@/features/dictionaries/lib/schedule.service.ts";
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
      city_ru: "",
      city_ua: "",
      district_ru: "",
      district_ua: "",
      street_ru: "",
      street_ua: "",
      building: "",
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
            city_ru: location.cityRu,
            city_ua: location.cityUa,
            district_ru: location.districtRu,
            district_ua: location.districtUa,
            street_ru: location.streetRu,
            street_ua: location.streetUa,
            building: location.building,
            phone: location.phone,
            scheduleGroups: mapScheduleToGroups(location.schedule),
          }
        : {
            name: "",
            city_ru: "",
            city_ua: "",
            district_ru: "",
            district_ua: "",
            street_ru: "",
            street_ua: "",
            building: "",
            phone: "",
            scheduleGroups: [],
          },
    );
  }, [isOpen, location, reset]);

  const mutation = useMutation({
    mutationFn: async (values: LocationFormValues) => {
      const payload = {
        name: values.name,
        city_ru: values.city_ru,
        city_ua: values.city_ua,
        district_ru: values.district_ru,
        district_ua: values.district_ua,
        street_ru: values.street_ru,
        street_ua: values.street_ua,
        building: values.building,
        phone: values.phone,
        schedule: mapScheduleGroupsToSchedule(values.scheduleGroups),
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
