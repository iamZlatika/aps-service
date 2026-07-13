import type { Location } from "@/features/backoffice/modules/dictionaries/types.ts";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";

interface LocationCheckboxGroupProps {
  locations: Location[];
  value: number | null;
  onChange: (id: number | null) => void;
  disabled?: boolean;
  clearable?: boolean;
}

export const LocationCheckboxGroup = ({
  locations,
  value,
  onChange,
  disabled,
  clearable = false,
}: LocationCheckboxGroupProps) => (
  <div className="flex flex-wrap gap-4">
    {locations.map((location) => (
      <label
        key={location.id}
        htmlFor={`location-${location.id}`}
        className="flex cursor-pointer select-none items-center gap-2"
      >
        <Checkbox
          id={`location-${location.id}`}
          checked={value === location.id}
          onCheckedChange={(checked) => {
            if (checked) onChange(location.id);
            else if (clearable) onChange(null);
          }}
          disabled={disabled}
          className="h-5 w-5"
        />
        <span className="text-base">{location.name}</span>
      </label>
    ))}
  </div>
);
