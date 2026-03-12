import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { dictionariesApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTable } from "@/features/backoffice/modules/dictionaries/components/table";
import { QueryPageGuard } from "@/shared/components/errors/QueryPageGuard.tsx";

const AccessoriesPage = () => {
  const { t } = useTranslation();

  const {
    data: accessories,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["accessories"],
    queryFn: dictionariesApi.getDictionaryAccessories,
  });

  return (
    <QueryPageGuard isError={isError} error={error} onRetry={() => refetch()}>
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
    </QueryPageGuard>
  );
};

export default AccessoriesPage;
