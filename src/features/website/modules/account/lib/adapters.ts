import { type VerifyPhoneCodeRequestBody } from "@/features/auth/website/api/dto";
import { type VerifyPhoneCodeFormValues } from "@/features/website/modules/account/account.schema";

export function mapVerifyPhoneCodeToRequestBody(
  values: VerifyPhoneCodeFormValues,
): VerifyPhoneCodeRequestBody {
  return { code: values.code };
}
