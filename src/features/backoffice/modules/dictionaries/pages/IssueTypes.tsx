import { issueTypesApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { DictionaryTable } from "@/shared/components/table";

const IssueTypesPage = () => (
  <DictionaryTable
    titleKey="sidebar.dictionaries_list.issue_types"
    api={issueTypesApi}
    queryKeyFn={queryKeys.dictionaries.issueTypes}
    columns={[
      {
        key: "name",
        labelKey: "sidebar.dictionaries_list.table.name",
        sortable: true,
      },
    ]}
  />
);

export default IssueTypesPage;
