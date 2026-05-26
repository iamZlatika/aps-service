import { WebsiteLogo } from "@/features/website/components/WebsiteLogo";

import { HamburgerButton } from "./HamburgerButton";

interface MobileBarProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const MobileBar = ({ isOpen, onOpen, onClose }: MobileBarProps) => (
  <div className="flex items-center justify-between border-b border-ws-line-soft py-[12px] md:hidden">
    <WebsiteLogo className="text-ws-ink-hi" />
    <HamburgerButton isOpen={isOpen} onClick={isOpen ? onClose : onOpen} />
  </div>
);
