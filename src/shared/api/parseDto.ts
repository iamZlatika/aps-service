import { type ZodType } from "zod";

import { captureError } from "@/shared/lib/sentry";

export function parseDto<T>(schema: ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    captureError(error, { source: "dto-validation" });
    throw error;
  }
}
