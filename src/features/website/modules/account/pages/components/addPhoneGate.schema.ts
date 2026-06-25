import { z } from "zod";

import { phoneField } from "@/shared/lib/zod-helpers";

export const createAddPhoneSchema = () =>
  z.object({
    phone: phoneField(),
  });

export type AddPhoneFormValues = z.infer<
  ReturnType<typeof createAddPhoneSchema>
>;
