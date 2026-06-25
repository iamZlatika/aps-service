import { type VerifyPhoneCodeData } from "@/features/auth/website/types";
import { type VerifyPhoneCodeFormValues } from "@/features/website/modules/account/account.schema";

export function mapVerifyPhoneCodeToRequestBody(
  values: VerifyPhoneCodeFormValues,
): VerifyPhoneCodeData {
  return { code: values.code };
}
