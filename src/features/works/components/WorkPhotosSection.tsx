import { type Control, Controller, type FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { WORK_TYPES, type WorkType } from "@/entities/work/types";
import { AdditionalPhotosInput } from "@/features/works/components/AdditionalPhotosInput";
import { WorkPhotoInput } from "@/features/works/components/WorkPhotoInput";
import { type WorkFormValues } from "@/features/works/lib/work.schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

interface WorkPhotosSectionProps {
  control: Control<WorkFormValues>;
  errors: FieldErrors<WorkFormValues>;
  workType: WorkType;
}

export const WorkPhotosSection = ({
  control,
  errors,
  workType,
}: WorkPhotosSectionProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t("works.form.section_photos")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {workType === WORK_TYPES.REPAIR && (
            <>
              <Controller
                control={control}
                name="before_photo"
                render={({ field }) => (
                  <WorkPhotoInput
                    label={t("works.photo.before")}
                    error={errors.before_photo}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="after_photo"
                render={({ field }) => (
                  <WorkPhotoInput
                    label={t("works.photo.after")}
                    error={errors.after_photo}
                    onChange={field.onChange}
                  />
                )}
              />
            </>
          )}
          {workType === WORK_TYPES.UPGRADE && (
            <Controller
              control={control}
              name="main_photo"
              render={({ field }) => (
                <WorkPhotoInput
                  label={t("works.photo.main")}
                  error={errors.main_photo}
                  onChange={field.onChange}
                />
              )}
            />
          )}
        </div>

        <Controller
          control={control}
          name="additional_photos"
          render={({ field }) => (
            <AdditionalPhotosInput
              label={t("works.photo.additional")}
              error={
                Array.isArray(errors.additional_photos)
                  ? errors.additional_photos[0]
                  : errors.additional_photos
              }
              onChange={field.onChange}
            />
          )}
        />
      </CardContent>
    </Card>
  );
};
