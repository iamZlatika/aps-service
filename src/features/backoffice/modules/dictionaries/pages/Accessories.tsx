import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { dictionariesApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTable } from "@/features/backoffice/modules/dictionaries/components/table";

const AccessoriesPage = () => {
  const { t } = useTranslation();

  const {
    data: accessories,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["accessories"],
    queryFn: dictionariesApi.getDictionaryAccessories,
  });

  return (
    <>
      {error && (
        <div className="text-red-600">{t("errors.loading_accessories")}</div>
      )}
      <DictionaryTable
        title={t("sidebar.dictionaries_list.accessories")}
        addButtonLabel={t("sidebar.dictionaries_list.table.add_button")}
        items={accessories}
        isLoading={isLoading}
        isFetching={isFetching}
        queryKey={["accessories"]}
        onAdd={(name) => dictionariesApi.createDictionaryAccessory({ name })}
        onDelete={(id) => dictionariesApi.deleteDictionaryAccessory(id)}
        onUpdate={(id, name) =>
          dictionariesApi.updateDictionaryAccessory(id, { name })
        }
      />
    </>
  );
};

export default AccessoriesPage;
