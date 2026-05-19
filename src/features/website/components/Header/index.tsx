import { DesktopNav } from "@/features/website/components/Header/DesktopNav";
import { MobileBar } from "@/features/website/components/Header/MobileBar";
import { MobileNav } from "@/features/website/components/Header/MobileNav";
import { useMobileNav } from "@/features/website/hooks/useMobileNav";

export const Header = () => {
  const { isOpen, open, close } = useMobileNav();

  return (
    <>
      <header className="ws-wrap">
        <DesktopNav />
        <MobileBar isOpen={isOpen} onOpen={open} onClose={close} />
      </header>
      <MobileNav isOpen={isOpen} close={close} />
    </>
  );
};
