import { issueTypesApi } from "@/features/backoffice/modules/dictionaries/api";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const IssueTypesPage = () => (
  <SmartTable
    titleKey="sidebar.dictionaries_list.issue_types"
    api={issueTypesApi}
    queryKeyFn={queryKeys.dictionaries.issueTypes}
    searchPlaceholder="search_placeholders.dictionaries_name"
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
