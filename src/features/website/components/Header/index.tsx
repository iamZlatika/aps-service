import { DesktopNav } from "@/features/website/components/Header/DesktopNav";
import { HeaderInfo } from "@/features/website/components/Header/HeaderInfo";
import { MobileBar } from "@/features/website/components/Header/MobileBar";
import { MobileHeaderInfo } from "@/features/website/components/Header/MobileHeaderInfo";
import { MobileNav } from "@/features/website/components/Header/MobileNav";
import { useMobileNav } from "@/features/website/hooks/useMobileNav";

export const Header = () => {
  const { isOpen, open, close } = useMobileNav();

  return (
    <>
      <header className="ws-wrap">
        <DesktopNav />
        <HeaderInfo />
        <MobileBar isOpen={isOpen} onOpen={open} onClose={close} />
        <MobileHeaderInfo />
      </header>
      <MobileNav isOpen={isOpen} close={close} />
    </>
  );
};
