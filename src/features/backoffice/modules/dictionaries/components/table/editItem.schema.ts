import i18next from "i18next";
import { z } from "zod";

export const editItemSchema = z.object({
  name: z.string().trim().min(1, i18next.t("validation.field_required")),
});

export type EditItemFormValues = z.infer<typeof editItemSchema>;
