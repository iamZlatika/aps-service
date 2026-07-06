import i18next from "i18next";
import { z } from "zod";

import { phoneRegex } from "@/shared/lib/constants";

export const zodEnumFromConst = <T extends Record<string, string>>(obj: T) =>
  z.enum(Object.values(obj) as [T[keyof T], ...T[keyof T][]]);

export function phoneField(message?: string) {
  return z.string().regex(phoneRegex, {
    message: message ?? i18next.t("validation.phone_invalid"),
  });
}
