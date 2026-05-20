import { PhoneIcon } from "@/features/website/components/icons/PhoneIcon";
import { PinIcon } from "@/features/website/components/icons/PinIcon";
import { type ContactLocation } from "@/features/website/config";

interface NavContactsProps {
  contacts: ContactLocation[];
}

export const NavContacts = ({ contacts }: NavContactsProps) => (
  <div className="hidden grid-cols-[auto_auto] items-center gap-x-[22px] gap-y-[5px] xl:grid">
    {contacts.map((c) => (
      <div key={c.phone} className="contents">
        <span className="flex items-center gap-2 whitespace-nowrap text-ws-sm font-medium leading-[1.2] text-ws-ink-soft">
          <PinIcon className="size-3.5 shrink-0 text-ws-ember-bright opacity-90" />
          {c.address}
        </span>
        <a
          href={`tel:${c.phone}`}
          className="flex items-center gap-2 whitespace-nowrap text-ws-sm font-semibold leading-[1.2] tracking-[0.005em] text-ws-ink no-underline transition-colors duration-200 hover:text-ws-ember-bright"
        >
          <PhoneIcon className="size-3.5 shrink-0 text-ws-ember-bright opacity-90" />
          {c.phoneFormatted}
        </a>
      </div>
    ))}
  </div>
);
