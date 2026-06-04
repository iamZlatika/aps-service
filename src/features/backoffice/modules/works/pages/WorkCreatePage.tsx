import { useTranslation } from "react-i18next";

const WorkCreatePage = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto w-full max-w-4xl p-3 sm:p-6">
      <h1 className="text-2xl font-bold">{t("works.create.title")}</h1>
    </div>
  );
};

export default WorkCreatePage;
