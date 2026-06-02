import { useTranslation } from "react-i18next";

const PriceListPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-3 sm:p-6">
      <h1 className="text-2xl font-bold">
        {t("sidebar.dictionaries_list.price_list")}
      </h1>
    </div>
  );
};

export default PriceListPage;
