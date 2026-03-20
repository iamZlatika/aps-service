import { intakeNotesApi } from "@/features/backoffice/modules/dictionaries/api";
import { DictionaryTable } from "@/features/backoffice/modules/dictionaries/components/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const IntakeNotesPage = () => (
  <DictionaryTable
    titleKey="sidebar.dictionaries_list.intake_notes"
    api={intakeNotesApi}
    queryKeyFn={queryKeys.dictionaries.intakeNotes}
  />
);

export default IntakeNotesPage;
