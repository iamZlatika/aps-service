import { useTranslation } from "react-i18next";

const MyFinancesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-2 sm:p-6 max-w-5xl mx-auto w-full">
      <h1 className="mb-6 text-2xl font-bold">{t("sidebar.my_finances")}</h1>
    </div>
  );
};

export default MyFinancesPage;
