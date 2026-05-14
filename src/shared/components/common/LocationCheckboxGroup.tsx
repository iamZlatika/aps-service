import type { Location } from "@/features/backoffice/modules/dictionaries/types.ts";
import { Checkbox } from "@/shared/components/ui/checkbox.tsx";

interface LocationCheckboxGroupProps {
  locations: Location[];
  value: number | null;
  onChange: (id: number) => void;
  disabled?: boolean;
}

export const LocationCheckboxGroup = ({
  locations,
  value,
  onChange,
  disabled,
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
          }}
          disabled={disabled}
          className="h-5 w-5"
        />
        <span className="text-base">{location.name}</span>
      </label>
    ))}
  </div>
);
