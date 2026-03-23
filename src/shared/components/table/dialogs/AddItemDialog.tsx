import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
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
import type { FieldConfig } from "./EditItemDialog";

interface AddItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: FieldConfig[];
  cancelLabel: string;
  confirmLabel: string;
  onConfirm: (values: Partial<BaseItem>) => void;
  isPending: boolean;
  schema?: z.ZodObject<Record<string, z.ZodString>>;
}

export const AddItemDialog = ({
  isOpen,
  onOpenChange,
  title,
  fields,
  cancelLabel,
  confirmLabel,
  onConfirm,
  isPending,
  schema: externalSchema,
}: AddItemDialogProps) => {
  const { t } = useTranslation();

  const schema = useMemo(
    () => externalSchema ?? buildEditSchema(fields),
    [externalSchema, fields],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Record<string, string>>({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(fields.map((f) => [f.key, ""])),
  });

  // Сбрасываем форму при открытии
  useEffect(() => {
    if (isOpen) {
      reset(Object.fromEntries(fields.map((f) => [f.key, ""])));
    }
  }, [isOpen, fields, reset]);

  const onSubmit = (data: Record<string, string>) => {
    onConfirm(data as Partial<BaseItem>);
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
