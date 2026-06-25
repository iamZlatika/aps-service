import { z } from "zod";

import { phoneField } from "@/shared/lib/zod-helpers";

export const createExtraPhoneSchema = () =>
  z.object({
    phone: phoneField(),
  });

export type ExtraPhoneFormValues = z.infer<
  ReturnType<typeof createExtraPhoneSchema>
>;
