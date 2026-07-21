import {
  type FieldError,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

type ContentFields = {
  description_ru: string;
  description_uk: string;
  reason_ru?: string;
  reason_uk?: string;
};

interface WorkContentSectionProps<T extends FieldValues & ContentFields> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const WorkContentSection = <T extends FieldValues & ContentFields>({
  register,
  errors,
}: WorkContentSectionProps<T>) => {
  const { t } = useTranslation();

  const contentErrors = errors as unknown as Partial<
    Record<keyof ContentFields, FieldError>
  >;

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
          <Textarea {...register("reason_ru" as Path<T>)} rows={3} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>
            {t("works.form.reason_uk")}{" "}
            <span className="text-xs text-muted-foreground">
              ({t("works.form.reason_optional")})
            </span>
          </Label>
          <Textarea {...register("reason_uk" as Path<T>)} rows={3} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>{t("works.form.description_ru")}</Label>
          <Textarea
            {...register("description_ru" as Path<T>)}
            className={
              contentErrors.description_ru ? "border-destructive" : undefined
            }
            rows={4}
          />
          {contentErrors.description_ru && (
            <p className="text-sm text-destructive">
              {contentErrors.description_ru.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>{t("works.form.description_uk")}</Label>
          <Textarea
            {...register("description_uk" as Path<T>)}
            className={
              contentErrors.description_uk ? "border-destructive" : undefined
            }
            rows={4}
          />
          {contentErrors.description_uk && (
            <p className="text-sm text-destructive">
              {contentErrors.description_uk.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
