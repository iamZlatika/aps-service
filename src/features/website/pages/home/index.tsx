import { DevicesSection } from "@/features/website/pages/home/components/devices";
import { Hero } from "@/features/website/pages/home/components/hero";
import { PcBuildSection } from "@/features/website/pages/home/components/pc-build";

export const HomePage = () => (
  <>
    <Hero />
    <DevicesSection />
    <PcBuildSection />
  </>
);

export default HomePage;
