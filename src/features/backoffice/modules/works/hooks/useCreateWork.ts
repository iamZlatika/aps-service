import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  type Work,
  WORK_PHOTO_TYPES,
  WORK_TYPES,
  type WorkPhoto,
  type WorkType,
} from "@/entities/work/types";
import { worksApi } from "@/features/backoffice/modules/works/api";
import { mapFormValuesToFormData } from "@/features/backoffice/modules/works/lib/adapters";
import {
  type WorkFormValues,
  workSchema,
} from "@/features/backoffice/modules/works/lib/work.schema";
import { buildPreviewWork } from "@/features/backoffice/modules/works/lib/work-preview.service";
import { WORKS_LINKS } from "@/features/backoffice/modules/works/navigation";
import { queryKeys } from "@/shared/api/queryKeys";
import { handleFormError } from "@/shared/lib/errors/handleFormError";
import { notifyError } from "@/shared/lib/errors/services";

type UseCreateWorkResult = {
  register: UseFormRegister<WorkFormValues>;
  control: Control<WorkFormValues>;
  errors: FieldErrors<WorkFormValues>;
  workType: WorkType;
  isPending: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  previewWork: Work | null;
  onPreviewConfirm: () => void;
  onPreviewClose: () => void;
};

function buildBlobPhotos(values: WorkFormValues): WorkPhoto[] {
  const photos: WorkPhoto[] = [];
  if (values.before_photo)
    photos.push({
      type: WORK_PHOTO_TYPES.BEFORE,
      url: URL.createObjectURL(values.before_photo),
    });
  if (values.after_photo)
    photos.push({
      type: WORK_PHOTO_TYPES.AFTER,
      url: URL.createObjectURL(values.after_photo),
    });
  if (values.main_photo)
    photos.push({
      type: WORK_PHOTO_TYPES.MAIN,
      url: URL.createObjectURL(values.main_photo),
    });
  values.additional_photos?.forEach((file) =>
    photos.push({
      type: WORK_PHOTO_TYPES.ADDITIONAL,
      url: URL.createObjectURL(file),
    }),
  );
  return photos;
}

export const useCreateWork = (): UseCreateWorkResult => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      type: WORK_TYPES.REPAIR,
      device_type: "",
      manufacturer: "",
      device_model: "",
      description_ru: "",
      description_uk: "",
      reason_ru: "",
      reason_uk: "",
      is_published: false,
    },
  });

  const [previewWork, setPreviewWork] = useState<Work | null>(null);
  const pendingValuesRef = useRef<WorkFormValues | null>(null);
  const blobUrlsRef = useRef<string[]>([]);

  const revokeBlobUrls = () => {
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    blobUrlsRef.current = [];
  };

  useEffect(() => {
    return revokeBlobUrls;
  }, []);

  const workType = useWatch({ control, name: "type" });

  const mutation = useMutation({
    mutationFn: (values: WorkFormValues) =>
      worksApi.create(mapFormValuesToFormData(values)),
    onSuccess: () => {
      revokeBlobUrls();
      void queryClient.invalidateQueries({ queryKey: queryKeys.works.all });
      navigate(WORKS_LINKS.root());
    },
    onError: (error) => {
      revokeBlobUrls();
      setPreviewWork(null);
      notifyError(error);
      handleFormError(error, setError);
    },
  });

  const openPreview = (values: WorkFormValues) => {
    revokeBlobUrls();
    const photos = buildBlobPhotos(values);
    blobUrlsRef.current = photos.map((p) => p.url);
    pendingValuesRef.current = values;
    setPreviewWork(buildPreviewWork(values, photos));
  };

  const onPreviewClose = () => {
    revokeBlobUrls();
    pendingValuesRef.current = null;
    setPreviewWork(null);
  };

  const onPreviewConfirm = () => {
    if (pendingValuesRef.current) {
      mutation.mutate(pendingValuesRef.current);
    }
  };

  return {
    register,
    control,
    errors,
    workType,
    isPending: mutation.isPending,
    onSubmit: handleSubmit(openPreview),
    previewWork,
    onPreviewConfirm,
    onPreviewClose,
  };
};
