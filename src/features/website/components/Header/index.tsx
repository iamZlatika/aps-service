import { DesktopNav } from "@/features/website/components/Header/DesktopNav";
import { HeaderInfo } from "@/features/website/components/Header/HeaderInfo";
import { MobileBar } from "@/features/website/components/Header/MobileBar";
import { MobileHeaderInfo } from "@/features/website/components/Header/MobileHeaderInfo";
import { MobileNav } from "@/features/website/components/Header/MobileNav";

interface HeaderProps {
  isNavOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
}

export const Header = ({ isNavOpen, openNav, closeNav }: HeaderProps) => {
  return (
    <>
      <header className="ws-wrap">
        <DesktopNav />
        <HeaderInfo />
        <MobileBar isOpen={isNavOpen} onOpen={openNav} onClose={closeNav} />
        <MobileHeaderInfo />
      </header>
      <MobileNav isOpen={isNavOpen} close={closeNav} />
    </>
  );
};
