import { getMapEmbedSrc } from "@/features/website/lib/service";

interface OfficeCardMapProps {
  address: string;
  street: string;
  building: string;
}

export const OfficeCardMap = ({
  address,
  street,
  building,
}: OfficeCardMapProps) => {
  return (
    <div className="ws-contacts-map">
      <iframe
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        src={getMapEmbedSrc(address)}
        title={`${street}, ${building}`}
        className="ws-contacts-map-iframe"
      />
    </div>
  );
};
