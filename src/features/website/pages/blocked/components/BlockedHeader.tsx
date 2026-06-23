import { LangSwitch } from "@/features/website/components/LangSwitch";
import { ThemeSwitch } from "@/features/website/components/ThemeSwitch";
import { WebsiteLogo } from "@/features/website/components/WebsiteLogo";

export const BlockedHeader = () => {
  return (
    <header className="ws-wrap flex items-center justify-between gap-[18px] py-[22px]">
      <WebsiteLogo />
      <div className="flex items-center gap-[10px]">
        <LangSwitch />
        <ThemeSwitch />
      </div>
    </header>
  );
};
