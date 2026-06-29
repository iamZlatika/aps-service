import type { LucideIcon } from "lucide-react";
import { ShieldCheck, Sparkles, Wrench } from "lucide-react";

export const ABOUT_PROCESS_IMAGES = [
  "/process1.webp",
  "/process2.webp",
  "/process3.webp",
  "/process4.webp",
  "/process5.webp",
  "/process6.webp",
  "/process8.webp",
  "/process10.webp",
] as const;

type StatEntry = {
  id: string;
  valueKey: string;
  labelKey: string;
};

export const STAT_KEYS: readonly StatEntry[] = [
  { id: "years", valueKey: "about.stat1n", labelKey: "about.stat1label" },
  { id: "repairs", valueKey: "about.stat2n", labelKey: "about.stat2label" },
  {
    id: "satisfaction",
    valueKey: "about.stat3n",
    labelKey: "about.stat3label",
  },
  { id: "partners", valueKey: "about.stat4n", labelKey: "about.stat4label" },
];

type WhyCard = {
  id: string;
  Icon: LucideIcon;
  titleKey: string;
  textKey: string;
};

export const WHY_CARDS: readonly WhyCard[] = [
  {
    id: "equipment",
    Icon: Wrench,
    titleKey: "about.why1Title",
    textKey: "about.why1Text",
  },
  {
    id: "innovation",
    Icon: Sparkles,
    titleKey: "about.why2Title",
    textKey: "about.why2Text",
  },
  {
    id: "guarantee",
    Icon: ShieldCheck,
    titleKey: "about.why3Title",
    textKey: "about.why3Text",
  },
];

type OfficeEntry = {
  src: string;
  addrKey: string;
  position: string;
};

export const OFFICES: readonly OfficeEntry[] = [
  {
    src: "/office.webp",
    addrKey: "about.office1addr",
    position: "object-[center_33%]",
  },
  {
    src: "/office1.webp",
    addrKey: "about.office2addr",
    position: "object-[center_40%]",
  },
];
