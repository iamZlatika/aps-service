export const SECURITY_BLOCK_MESSAGE =
  "Request blocked. Please contact support.";

export function isSecurityBlockedResponse(
  status: number | undefined,
  message: string | undefined,
): boolean {
  return status === 403 && message === SECURITY_BLOCK_MESSAGE;
}
