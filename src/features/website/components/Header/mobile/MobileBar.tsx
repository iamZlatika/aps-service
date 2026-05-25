import { Phone } from "lucide-react";

import { WebsiteLogo } from "@/features/website/components/WebsiteLogo";
import { CONTACTS } from "@/features/website/config";

import { HamburgerButton } from "./HamburgerButton";

interface MobileBarProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const MobileBar = ({ isOpen, onOpen, onClose }: MobileBarProps) => (
  <div className="flex items-center justify-between border-b border-ws-line-soft py-[18px] md:hidden">
    <WebsiteLogo className="text-ws-ink-hi" />

    <div className="flex items-center gap-2">
      <a
        href={`tel:${CONTACTS[0].phone}`}
        aria-label={CONTACTS[0].phoneFormatted}
        className="inline-flex size-ws-ctrl items-center justify-center rounded-ws-ctrl border border-ws-line bg-white/[0.015] text-ws-ink-hi transition-all duration-200 hover:-translate-y-px hover:border-transparent hover:bg-ws-ember hover:text-white"
      >
        <Phone className="size-4" />
      </a>
      <HamburgerButton isOpen={isOpen} onClick={isOpen ? onClose : onOpen} />
    </div>
  </div>
);
