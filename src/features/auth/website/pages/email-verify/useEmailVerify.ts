import { useEffect, useState } from "react";

import { websiteAuthApi } from "@/features/auth/website/api";

type VerifyStatus = "loading" | "success" | "error";

type UseEmailVerifyReturn = {
  status: VerifyStatus;
};

export const useEmailVerify = (
  verifyUrl: string | null,
): UseEmailVerifyReturn => {
  const [status, setStatus] = useState<VerifyStatus>(
    verifyUrl ? "loading" : "error",
  );

  useEffect(() => {
    if (!verifyUrl) return;

    websiteAuthApi
      .emailVerify(verifyUrl)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [verifyUrl]);

  return { status };
};
