import { Trash2 } from "lucide-react";
import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFormTrigger,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { LocationFormValues } from "@/features/dictionaries/lib/location.schema.ts";
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

interface ScheduleRowProps {
  control: Control<LocationFormValues>;
  index: number;
  errors: FieldErrors<LocationFormValues>;
  trigger: UseFormTrigger<LocationFormValues>;
  usedByOthers: Set<number>;
  onRemove: () => void;
}

export const ScheduleRow = ({
  control,
  index,
  errors,
  trigger,
  usedByOthers,
  onRemove,
}: ScheduleRowProps) => {
  const { t } = useTranslation();
  const rowErrors = errors.scheduleGroups?.[index];
  const hasTimeError = !!rowErrors?.from || !!rowErrors?.to;

  return (
    <div className="flex flex-col gap-1">
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
          onClick={onRemove}
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
};
