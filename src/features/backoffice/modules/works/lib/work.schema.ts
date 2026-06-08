import i18next from "i18next";
import { z } from "zod";

import { WORK_TYPES } from "@/entities/work/types";
import { zodEnumFromConst } from "@/shared/lib/zod-helpers";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2 MB

const imageFile = () =>
  z
    .instanceof(File)
    .refine((f) => ALLOWED_MIME_TYPES.includes(f.type), {
      message: i18next.t("validation.image_type"),
    })
    .refine((f) => f.size <= MAX_PHOTO_SIZE, {
      message: i18next.t("validation.image_max_size"),
    });

const requiredString = () =>
  z.string().min(1, i18next.t("validation.field_required"));

export const workSchema = z
  .object({
    type: zodEnumFromConst(WORK_TYPES),
    device_type: requiredString(),
    manufacturer: requiredString(),
    device_model: requiredString(),
    description_ru: requiredString(),
    description_uk: requiredString(),
    reason_ru: z.string().optional(),
    reason_uk: z.string().optional(),
    is_published: z.boolean(),
    main_photo: imageFile().optional(),
    before_photo: imageFile().optional(),
    after_photo: imageFile().optional(),
    additional_photos: z.array(imageFile()).max(5).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === WORK_TYPES.UPGRADE && !data.main_photo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18next.t("validation.field_required"),
        path: ["main_photo"],
      });
    }
    if (data.type === WORK_TYPES.REPAIR) {
      if (!data.before_photo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18next.t("validation.field_required"),
          path: ["before_photo"],
        });
      }
      if (!data.after_photo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18next.t("validation.field_required"),
          path: ["after_photo"],
        });
      }
    }
  });

export type WorkFormValues = z.infer<typeof workSchema>;
