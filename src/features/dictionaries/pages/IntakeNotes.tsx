import { intakeNotesApi } from "@/features/dictionaries/api";
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

const IntakeNotesPage = () => (
  <DictionaryTablePage
    titleKey="sidebar.dictionaries_list.intake_notes"
    api={intakeNotesApi}
    queryKeyFn={queryKeys.dictionaries.intakeNotes}
    columns={columns}
  />
);

export default IntakeNotesPage;
