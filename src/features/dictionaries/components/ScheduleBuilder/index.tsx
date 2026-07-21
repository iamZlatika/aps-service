import { Plus } from "lucide-react";
import {
  type Control,
  type FieldErrors,
  useFieldArray,
  type UseFormGetValues,
  type UseFormTrigger,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { LocationFormValues } from "@/features/dictionaries/lib/location.schema.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { WEEK_DAYS } from "@/shared/types";

import { ScheduleRow } from "./ScheduleRow";
import { getUsedIndices } from "./utils";

interface ScheduleBuilderProps {
  control: Control<LocationFormValues>;
  errors: FieldErrors<LocationFormValues>;
  getValues: UseFormGetValues<LocationFormValues>;
  trigger: UseFormTrigger<LocationFormValues>;
}

export const ScheduleBuilder = ({
  control,
  errors,
  getValues,
  trigger,
}: ScheduleBuilderProps) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "scheduleGroups",
  });

  const watchedGroups = useWatch({ control, name: "scheduleGroups" }) ?? [];
  const allUsedIndices = getUsedIndices(watchedGroups);

  const handleAppend = () => {
    const usedIndices = getUsedIndices(getValues("scheduleGroups"));
    const firstFree = [0, 1, 2, 3, 4, 5, 6].find((i) => !usedIndices.has(i));
    if (firstFree == null) return;

    let lastFree = firstFree;
    while (lastFree + 1 <= 6 && !usedIndices.has(lastFree + 1)) lastFree++;

    append({
      fromDay: WEEK_DAYS[firstFree],
      toDay: WEEK_DAYS[lastFree],
      from: "09:00",
      to: "18:00",
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">
        {t("dictionaries.locations.form.schedule")}
      </p>

      {fields.map((field, index) => (
        <ScheduleRow
          key={field.id}
          control={control}
          index={index}
          errors={errors}
          trigger={trigger}
          usedByOthers={getUsedIndices(watchedGroups, index)}
          onRemove={() => remove(index)}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        disabled={allUsedIndices.size >= WEEK_DAYS.length}
        onClick={handleAppend}
      >
        <Plus className="mr-1.5 h-4 w-4" />
        {t("dictionaries.locations.form.add_schedule_group")}
      </Button>
    </div>
  );
};
