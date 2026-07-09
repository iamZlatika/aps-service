import { type Location } from "@/entities/location/types";
import { parseScheduleLines } from "@/features/website/lib/service";
import { OfficeCardInfo } from "@/features/website/pages/contacts/OfficeCardInfo";
import { OfficeCardMap } from "@/features/website/pages/contacts/OfficeCardMap";
import { useLocalize } from "@/shared/hooks/useLocalize";
import { cn } from "@/shared/lib/utils";

interface OfficeCardProps {
  location: Location;
  isReverse: boolean;
}

export const OfficeCard = ({ location, isReverse }: OfficeCardProps) => {
  const localize = useLocalize();
  const street = localize(location.streetRu, location.streetUa);
  const district = localize(location.districtRu, location.districtUa);
  const city = localize(location.cityRu, location.cityUa);
  const address = localize(location.addressRu, location.addressUa);
  const scheduleLines = parseScheduleLines(location.scheduleDisplay);

  return (
    <div
      className={cn(
        "ws-contacts-office",
        isReverse && "ws-contacts-office-reverse",
      )}
    >
      <OfficeCardInfo
        street={street}
        district={district}
        city={city}
        building={location.building}
        phone={location.phone}
        reviewUrl={location.reviewUrl}
        scheduleLines={scheduleLines}
      />
      <OfficeCardMap
        address={address}
        street={street}
        building={location.building}
      />
    </div>
  );
};
