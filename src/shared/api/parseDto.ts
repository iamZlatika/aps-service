import { type ZodSchema } from "zod";

import { captureError } from "@/shared/lib/sentry";

export function parseDto<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    captureError(error, { source: "dto-validation" });
    throw error;
  }
}
