import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { type WorkFormValues } from "@/features/backoffice/modules/works/lib/work.schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

interface WorkContentSectionProps {
  register: UseFormRegister<WorkFormValues>;
  errors: FieldErrors<WorkFormValues>;
}

export const WorkContentSection = ({
  register,
  errors,
}: WorkContentSectionProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t("works.form.section_content")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>
            {t("works.form.reason_ru")}{" "}
            <span className="text-xs text-muted-foreground">
              ({t("works.form.reason_optional")})
            </span>
          </Label>
          <Textarea {...register("reason_ru")} rows={3} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>
            {t("works.form.reason_uk")}{" "}
            <span className="text-xs text-muted-foreground">
              ({t("works.form.reason_optional")})
            </span>
          </Label>
          <Textarea {...register("reason_uk")} rows={3} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>{t("works.form.description_ru")}</Label>
          <Textarea
            {...register("description_ru")}
            className={errors.description_ru ? "border-destructive" : undefined}
            rows={4}
          />
          {errors.description_ru && (
            <p className="text-sm text-destructive">
              {errors.description_ru.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>{t("works.form.description_uk")}</Label>
          <Textarea
            {...register("description_uk")}
            className={errors.description_uk ? "border-destructive" : undefined}
            rows={4}
          />
          {errors.description_uk && (
            <p className="text-sm text-destructive">
              {errors.description_uk.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
