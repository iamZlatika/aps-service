import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm, type UseFormSetError } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { FieldConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

import { buildEditSchema } from "../../lib/buildEditSchema.ts";
import { PhoneMaskInput } from "../inputs/PhoneMaskInput.tsx";

interface ItemFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: FieldConfig[];
  values?: Record<string, unknown>;
  onConfirm: (
    values: Record<string, unknown>,
    setError: UseFormSetError<Record<string, string>>,
  ) => void;
  isPending: boolean;
  cancelLabel: string;
  confirmLabel: string;
  schema?: Parameters<typeof zodResolver>[0];
}

export const ItemFormDialog = ({
  isOpen,
  onOpenChange,
  title,
  fields,
  values,
  onConfirm,
  isPending,
  cancelLabel,
  confirmLabel,
  schema: externalSchema,
}: ItemFormDialogProps) => {
  const { t } = useTranslation();

  const schema = useMemo(
    () => externalSchema ?? buildEditSchema(fields, t),
    [externalSchema, fields, t],
  );

  const defaultValues = useMemo(
    () =>
      Object.fromEntries(
        fields.map((f) => [
          f.key,
          values?.[f.key] != null ? String(values[f.key]) : "",
        ]),
      ),
    [values, fields],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, defaultValues, reset]);

  const onSubmit = (data: unknown) => {
    onConfirm(data as Record<string, unknown>, setError);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="py-4 flex flex-col gap-3"
        >
          {fields.map((field) => (
            <div key={field.key}>
              <label className="text-sm font-medium">{field.label}</label>

              {field.type === "select" && field.options ? (
                <Controller
                  control={control}
                  name={field.key}
                  render={({ field: { onChange, value } }) => (
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger
                        className={errors[field.key] ? "border-red-500" : ""}
                      >
                        <SelectValue
                          placeholder={
                            field.placeholder ?? t("table.select_placeholder")
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options!.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : field.type === "phone" ? (
                <Controller
                  control={control}
                  name={field.key}
                  render={({ field: { onChange, value } }) => (
                    <PhoneMaskInput
                      value={value}
                      onChange={onChange}
                      placeholder={field.placeholder}
                      className={errors[field.key] ? "border-red-500" : ""}
                    />
                  )}
                />
              ) : (
                <Input
                  {...register(field.key)}
                  type={field.inputType ?? "text"}
                  placeholder={field.placeholder}
                  className={errors[field.key] ? "border-red-500" : ""}
                />
              )}

              {errors[field.key] && (
                <span className="text-xs text-red-500 mt-1">
                  {String(errors[field.key]?.message)}
                </span>
              )}
            </div>
          ))}
          {errors.root && (
            <p className="text-sm text-red-500">{errors.root.message}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isPending}
            >
              {isPending ? t("loader.default") : confirmLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
