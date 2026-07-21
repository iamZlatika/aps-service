import { issueTypesApi } from "@/features/dictionaries/api";
import { DictionaryTablePage } from "@/features/dictionaries/components/DictionaryTablePage.tsx";
import type { DictionaryItem } from "@/features/dictionaries/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import type { ColumnConfig } from "@/widgets/table/models/types.ts";

const columns: ColumnConfig<DictionaryItem>[] = [
  {
    key: "name",
    field: "name",
    labelKey: "dictionaries.table_fields.name",
    sortable: true,
  },
];

const IssueTypesPage = () => (
  <DictionaryTablePage
    titleKey="sidebar.dictionaries_list.issue_types"
    api={issueTypesApi}
    queryKeyFn={queryKeys.dictionaries.issueTypes}
    columns={columns}
  />
);

export default IssueTypesPage;
