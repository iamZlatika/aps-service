import { type ReactNode } from "react";

import { Button } from "@/shared/components/ui/button.tsx";

interface SegmentedControlOption<T extends string> {
  label: ReactNode | string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  options: SegmentedControlOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
}

const SegmentedControl = <T extends string>({
  value,
  options,
  onChange,
  disabled,
}: SegmentedControlProps<T>) => {
  return (
    <div className="flex items-center border rounded-md overflow-hidden">
      {options.map((option, index) => (
        <div key={option.value} className="flex items-center">
          <Button
            variant={option.value === value ? "default" : "ghost"}
            size="sm"
            className="rounded-none h-8 px-3"
            onClick={() => onChange(option.value)}
            disabled={disabled}
          >
            {option.label}
          </Button>

          {index < options.length - 1 && (
            <div className="w-[1px] h-4 bg-border" />
          )}
        </div>
      ))}
    </div>
  );
};

export default SegmentedControl;
