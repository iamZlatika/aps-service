import { Plus, Trash2 } from "lucide-react";
import {
  type Control,
  Controller,
  type FieldErrors,
  useFieldArray,
  type UseFormGetValues,
  type UseFormTrigger,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { LocationFormValues } from "@/features/backoffice/modules/dictionaries/lib/location.schema.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";
import { cn } from "@/shared/lib/utils.ts";
import { WEEK_DAYS } from "@/shared/types";

interface ScheduleBuilderProps {
  control: Control<LocationFormValues>;
  errors: FieldErrors<LocationFormValues>;
  getValues: UseFormGetValues<LocationFormValues>;
  trigger: UseFormTrigger<LocationFormValues>;
}

// Object lookup avoids any readonly-tuple indexOf edge cases
const DAY_INDEX: Record<string, number> = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
};

function getUsedIndices(
  groups: { fromDay?: string; toDay?: string }[],
  excludeIndex = -1,
): Set<number> {
  const used = new Set<number>();
  groups.forEach((group, idx) => {
    if (idx === excludeIndex) return;
    const f = DAY_INDEX[group.fromDay ?? ""];
    const t = DAY_INDEX[group.toDay ?? ""];
    if (f == null || t == null) return;
    for (let i = Math.min(f, t); i <= Math.max(f, t); i++) used.add(i);
  });
  return used;
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
    // getValues reads form state synchronously, avoiding stale useWatch closure
    const usedIndices = getUsedIndices(getValues("scheduleGroups"));

    const firstFree = [0, 1, 2, 3, 4, 5, 6].find((i) => !usedIndices.has(i));
    if (firstFree == null) return;

    // Extend to cover all consecutive free days
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

      {fields.map((field, index) => {
        const rowErrors = errors.scheduleGroups?.[index];
        const hasTimeError = !!rowErrors?.from || !!rowErrors?.to;
        const usedByOthers = getUsedIndices(watchedGroups, index);

        return (
          <div key={field.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name={`scheduleGroups.${index}.fromDay`}
                render={({ field: f }) => (
                  <Select value={f.value} onValueChange={f.onChange}>
                    <SelectTrigger className="w-[72px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEK_DAYS.map((day, i) => (
                        <SelectItem
                          key={day}
                          value={day}
                          disabled={usedByOthers.has(i)}
                        >
                          {t(`dictionaries.locations.form.days.${day}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <span className="text-sm text-muted-foreground">—</span>

              <Controller
                control={control}
                name={`scheduleGroups.${index}.toDay`}
                render={({ field: f }) => (
                  <Select value={f.value} onValueChange={f.onChange}>
                    <SelectTrigger className="w-[72px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEK_DAYS.map((day, i) => (
                        <SelectItem
                          key={day}
                          value={day}
                          disabled={usedByOthers.has(i)}
                        >
                          {t(`dictionaries.locations.form.days.${day}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                control={control}
                name={`scheduleGroups.${index}.from`}
                render={({ field: f }) => (
                  <Input
                    type="time"
                    value={f.value}
                    onChange={(e) => {
                      f.onChange(e);
                      void trigger(`scheduleGroups.${index}`);
                    }}
                    onBlur={f.onBlur}
                    className={cn(
                      "w-[112px] text-sm",
                      rowErrors?.from && "border-destructive",
                    )}
                  />
                )}
              />

              <span className="text-sm text-muted-foreground">—</span>

              <Controller
                control={control}
                name={`scheduleGroups.${index}.to`}
                render={({ field: f }) => (
                  <Input
                    type="time"
                    value={f.value}
                    onChange={(e) => {
                      f.onChange(e);
                      void trigger(`scheduleGroups.${index}`);
                    }}
                    onBlur={f.onBlur}
                    className={cn(
                      "w-[112px] text-sm",
                      rowErrors?.to && "border-destructive",
                    )}
                  />
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>

            {hasTimeError && (
              <p className="text-xs text-destructive">
                {rowErrors?.from?.message || rowErrors?.to?.message}
              </p>
            )}
          </div>
        );
      })}

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
