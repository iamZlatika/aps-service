import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";

import { GRANULARITIES, type Granularity } from "../../types.ts";

interface GranularitySelectProps {
  value: Granularity | undefined;
  placeholder: Granularity;
  onChange: (value: Granularity) => void;
}

export const GranularitySelect = ({
  value,
  placeholder,
  onChange,
}: GranularitySelectProps) => {
  const { t } = useTranslation();

  return (
    <Select value={value} onValueChange={(val) => onChange(val as Granularity)}>
      <SelectTrigger className="h-9 w-36 text-sm">
        <SelectValue
          placeholder={t(`statistics.revenue.granularity.${placeholder}`)}
        />
      </SelectTrigger>
      <SelectContent>
        {Object.values(GRANULARITIES).map((granularity) => (
          <SelectItem key={granularity} value={granularity}>
            {t(`statistics.revenue.granularity.${granularity}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
