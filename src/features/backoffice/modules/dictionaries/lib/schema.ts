import i18next from "i18next";
import { z } from "zod";

import { zodEnumFromConst } from "@/shared/lib/zod-helpers.ts";
import { STATUS_COLORS } from "@/shared/types.ts";

export const NewOrderStatusSchema = z.object({
  key: z
    .string()
    .min(
      1,
      i18next.t("validation.minCharsIs", {
        chars: 1,
      }),
    )
    .regex(/^[a-zA-Z0-9_]+$/, i18next.t("validation.onlyLat")),

  name_ru: z.string().min(1, i18next.t("validation.field_required")),
  name_ua: z.string().min(1, i18next.t("validation.field_required")),

  color: z
    .string()
    .min(1, i18next.t("validation.colorRequired"))
    .pipe(zodEnumFromConst(STATUS_COLORS)),
});

export const EditOrderStatusSchema = NewOrderStatusSchema.omit({ key: true });
