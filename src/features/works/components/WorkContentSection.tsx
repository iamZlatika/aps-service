import {
  type FieldError,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { RequiredMark } from "@/features/works/components/RequiredMark";
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

type ContentField = keyof ContentFields;

interface WorkContentSectionProps<T extends FieldValues & ContentFields> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  /** A repair needs the reason in both languages; an upgrade has none. */
  isReasonRequired: boolean;
}

export const WorkContentSection = <T extends FieldValues & ContentFields>({
  register,
  errors,
  isReasonRequired,
}: WorkContentSectionProps<T>) => {
  const { t } = useTranslation();

  const contentErrors = errors as unknown as Partial<
    Record<ContentField, FieldError>
  >;

  const renderField = (name: ContentField, rows: number, required: boolean) => {
    const error = contentErrors[name];
    return (
      <div className="flex flex-col gap-1.5">
        <Label>
          {t(`works.form.${name}`)}{" "}
          {required ? (
            <RequiredMark />
          ) : (
            <span className="text-xs text-muted-foreground">
              ({t("works.form.reason_optional")})
            </span>
          )}
        </Label>
        <Textarea
          {...register(name as Path<T>)}
          className={error ? "border-destructive" : undefined}
          rows={rows}
        />
        {error && <p className="text-sm text-destructive">{error.message}</p>}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t("works.form.section_content")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {renderField("reason_ru", 3, isReasonRequired)}
        {renderField("reason_uk", 3, isReasonRequired)}
        {renderField("description_ru", 4, true)}
        {renderField("description_uk", 4, true)}
      </CardContent>
    </Card>
  );
};
