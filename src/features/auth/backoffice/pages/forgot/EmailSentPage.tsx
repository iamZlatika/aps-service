import { useTranslation } from "react-i18next";

import MailCheckIcon from "@/shared/components/icons/mail-icon.tsx";

const EmailSentPage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex flex-row items-center gap-6 max-w-xl">
        <MailCheckIcon />
        <div>
          <p className="mb-2">{t("auth.forgot.email_sent_p1")}</p>
          <p>{t("auth.forgot.email_sent_p2")}</p>
        </div>
      </div>
    </div>
  );
};

export default EmailSentPage;
