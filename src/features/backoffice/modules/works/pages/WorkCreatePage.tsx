import { ArrowLeft } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { WorkContentSection } from "@/features/backoffice/modules/works/components/WorkContentSection";
import { WorkDeviceSection } from "@/features/backoffice/modules/works/components/WorkDeviceSection";
import { WorkPhotosSection } from "@/features/backoffice/modules/works/components/WorkPhotosSection";
import { WorkPreviewModal } from "@/features/backoffice/modules/works/components/WorkPreviewModal";
import { useCreateWork } from "@/features/backoffice/modules/works/hooks/useCreateWork";
import { WORKS_LINKS } from "@/features/backoffice/modules/works/navigation";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";

const WorkCreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    control,
    errors,
    workType,
    isPending,
    onSubmit,
    previewWork,
    onPreviewConfirm,
    onPreviewClose,
  } = useCreateWork();

  const handleBack = () => navigate(WORKS_LINKS.root());

  return (
    <div className="mx-auto w-full max-w-3xl p-3 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" type="button" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{t("works.form.create_title")}</h1>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <WorkDeviceSection control={control} errors={errors} />
        <WorkPhotosSection
          control={control}
          errors={errors}
          workType={workType}
        />
        <WorkContentSection register={register} errors={errors} />

        {errors.root && (
          <p className="text-sm text-destructive">{errors.root.message}</p>
        )}

        <div className="flex items-center justify-between">
          <Controller
            control={control}
            name="is_published"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_published"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="is_published">
                  {t("works.form.is_published")}
                </Label>
              </div>
            )}
          />
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleBack}>
              {t("works.form.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {t("works.form.submit")}
            </Button>
          </div>
        </div>
      </form>

      <WorkPreviewModal
        work={previewWork}
        onClose={onPreviewClose}
        onConfirm={onPreviewConfirm}
        isPending={isPending}
      />
    </div>
  );
};

export default WorkCreatePage;
