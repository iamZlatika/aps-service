import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { accessoriesApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTable } from "@/features/backoffice/modules/dictionaries/components/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";
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
    queryKey: queryKeys.dictionaries.accessories(),
    queryFn: accessoriesApi.getAll,
  });

  return (
    <QueryPageGuard isError={isError} error={error} onRetry={() => refetch()}>
      <DictionaryTable
        title={t("sidebar.dictionaries_list.accessories")}
        addButtonLabel={t("sidebar.dictionaries_list.table.add_button")}
        items={accessories}
        isLoading={isLoading}
        isFetching={isFetching}
        queryKey={queryKeys.dictionaries.accessories()}
        onAdd={(name) => accessoriesApi.create({ name })}
        onDelete={(id) => accessoriesApi.remove(id)}
        onUpdate={(id, name) => accessoriesApi.update(id, { name })}
      />
    </QueryPageGuard>
  );
};

export default AccessoriesPage;
