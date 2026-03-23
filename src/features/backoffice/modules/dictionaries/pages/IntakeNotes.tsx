import { intakeNotesApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { DictionaryTable } from "@/shared/components/table";

const IntakeNotesPage = () => (
  <DictionaryTable
    titleKey="sidebar.dictionaries_list.intake_notes"
    api={intakeNotesApi}
    queryKeyFn={queryKeys.dictionaries.intakeNotes}
    columns={[
      {
        key: "name",
        labelKey: "sidebar.dictionaries_list.table.name",
        sortable: true,
      },
    ]}
  />
);

export default IntakeNotesPage;
