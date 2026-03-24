import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm, type UseFormSetError } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { z } from "zod";

import { type BaseItem } from "@/shared/components/table/types.ts";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Input } from "@/shared/components/ui/input.tsx";

import { buildEditSchema } from "../lib/buildEditSchema";

export interface FieldConfig {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

interface EditItemDialogProps<T extends BaseItem> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: FieldConfig[];
  values: Partial<T>;
  onConfirm: (
    values: Partial<BaseItem>,
    setError: UseFormSetError<Record<string, string>>,
  ) => void;
  isPending: boolean;
  cancelLabel: string;
  confirmLabel: string;
  schema?: z.ZodObject<Record<string, z.ZodString>>;
}

export const EditItemDialog = <T extends BaseItem>({
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
}: EditItemDialogProps<T>) => {
  const { t } = useTranslation();

  const schema = useMemo(
    () => externalSchema ?? buildEditSchema(fields),
    [externalSchema, fields],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<Record<string, string>>({
    resolver: zodResolver(schema),
    defaultValues: values as Record<string, string>,
  });

  useEffect(() => {
    if (isOpen) {
      reset(values as Record<string, string>);
    }
  }, [isOpen, values, reset]);

  const onSubmit = (data: Record<string, string>) => {
    onConfirm(data as Partial<BaseItem>, setError);
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
              <Input
                {...register(field.key)}
                placeholder={field.placeholder}
                className={errors[field.key] ? "border-red-500" : ""}
              />
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
            <Button type="submit" disabled={isPending}>
              {isPending ? t("loader.default") : confirmLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
