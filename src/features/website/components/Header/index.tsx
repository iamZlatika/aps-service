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
      <header className="sticky top-0 z-50 bg-ws-bg">
        <div className="ws-wrap">
          <DesktopNav />
          <HeaderInfo />
          <MobileBar isOpen={isNavOpen} onOpen={openNav} onClose={closeNav} />
        </div>
      </header>
      <div className="ws-wrap w-full">
        <MobileHeaderInfo />
      </div>
      <MobileNav isOpen={isNavOpen} close={closeNav} />
    </>
  );
};
