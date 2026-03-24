import { issueTypesApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { SmartTable } from "@/shared/components/table";

const IssueTypesPage = () => (
  <SmartTable
    titleKey="sidebar.dictionaries_list.issue_types"
    api={issueTypesApi}
    queryKeyFn={queryKeys.dictionaries.issueTypes}
    columns={[
      {
        key: "name",
        labelKey: "table.name",
        sortable: true,
      },
    ]}
  />
);

export default IssueTypesPage;
