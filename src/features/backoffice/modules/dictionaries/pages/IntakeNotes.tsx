import { intakeNotesApi } from "@/features/backoffice/modules/dictionaries/api";
import { SmartTable } from "@/features/backoffice/widgets/table";
import { queryKeys } from "@/shared/api/queryKeys.ts";

const IntakeNotesPage = () => (
  <SmartTable
    titleKey="sidebar.dictionaries_list.intake_notes"
    api={intakeNotesApi}
    queryKeyFn={queryKeys.dictionaries.intakeNotes}
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

export default IntakeNotesPage;
