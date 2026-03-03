import MailCheckIcon from "@/shared/components/icons/mail-icon.tsx";

const EmailSentPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex flex-row items-center gap-6 max-w-xl">
        <MailCheckIcon />
        <div>
          <p className="mb-2">
            Если аккаунт с указанным email существует, мы отправили письмо со
            ссылкой для создания нового пароля.
          </p>
          <p>
            Ссылка действует ограниченное время. Если письмо не пришло —
            проверьте папку «Спам» или попробуйте снова.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailSentPage;
