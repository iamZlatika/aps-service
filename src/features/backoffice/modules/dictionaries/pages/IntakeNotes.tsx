import { intakeNotesApi } from "@/features/backoffice/modules/dictionaries/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { SmartTable } from "@/shared/components/table";

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
