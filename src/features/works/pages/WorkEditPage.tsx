import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { WorkContentSection } from "@/features/works/components/WorkContentSection.tsx";
import { WorkDeviceSection } from "@/features/works/components/WorkDeviceSection.tsx";
import { useEditWork } from "@/features/works/hooks/useEditWork.ts";
import { Loader } from "@/shared/components/common/Loader.tsx";
import { Button } from "@/shared/components/ui/button.tsx";

const WorkEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const workId = id ? parseInt(id, 10) : 0;
  const { t } = useTranslation();

  const { register, control, errors, isPending, isLoading, onSubmit, onBack } =
    useEditWork(workId);

  if (isLoading) return <Loader />;

  return (
    <div className="mx-auto w-full max-w-3xl p-3 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" type="button" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{t("works.form.edit_title")}</h1>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <WorkDeviceSection
          control={control}
          errors={errors}
          showWorkType={false}
        />
        <WorkContentSection register={register} errors={errors} />

        {errors.root && (
          <p className="text-sm text-destructive">{errors.root.message}</p>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onBack}>
            {t("works.form.cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {t("common.save")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WorkEditPage;
