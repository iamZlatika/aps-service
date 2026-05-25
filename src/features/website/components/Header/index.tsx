import { DesktopNav } from "./desktop/DesktopNav";
import { HeaderInfo } from "./desktop/HeaderInfo";
import { MobileBar } from "./mobile/MobileBar";
import { MobileHeaderInfo } from "./mobile/MobileHeaderInfo";
import { MobileNav } from "./mobile/MobileNav";

interface HeaderProps {
  isNavOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
}

export const Header = ({ isNavOpen, openNav, closeNav }: HeaderProps) => {
  return (
    <>
      <header>
        <div className="ws-wrap">
          <DesktopNav />
          <HeaderInfo />
          <MobileBar isOpen={isNavOpen} onOpen={openNav} onClose={closeNav} />
          <MobileHeaderInfo />
        </div>
      </header>
      <MobileNav isOpen={isNavOpen} close={closeNav} />
    </>
  );
};
