import { useTranslation } from "react-i18next";

const BalancesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-2 sm:p-6 max-w-5xl mx-auto w-full">
      <h1 className="mb-6 text-2xl font-bold">{t("sidebar.billing")}</h1>
    </div>
  );
};

export default BalancesPage;
