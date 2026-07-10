import type { LucideIcon } from "lucide-react";
import { CalendarClock, CheckCircle2, ShieldCheck } from "lucide-react";

type WarrantyCard = {
  id: string;
  Icon: LucideIcon;
  valueKey: string;
  unitKey: string;
  textKey: string;
};

export const WARRANTY_CARDS: readonly WarrantyCard[] = [
  {
    id: "term",
    Icon: ShieldCheck,
    valueKey: "warranty.card1n",
    unitKey: "warranty.card1unit",
    textKey: "warranty.card1text",
  },
  {
    id: "storage",
    Icon: CalendarClock,
    valueKey: "warranty.card2n",
    unitKey: "warranty.card2unit",
    textKey: "warranty.card2text",
  },
  {
    id: "promise",
    Icon: CheckCircle2,
    valueKey: "warranty.card3title",
    unitKey: "",
    textKey: "warranty.card3text",
  },
] as const;

export type WarrantySectionStyle = "numbered" | "dot";

type WarrantySectionEntry = {
  id: string;
  titleKey: string;
  introKey?: string;
  itemsKey: string;
  style: WarrantySectionStyle;
  ratesAfterIndex?: number;
};

export const WARRANTY_SECTIONS: readonly WarrantySectionEntry[] = [
  {
    id: "general",
    titleKey: "warranty.section1Title",
    itemsKey: "warranty.section1Items",
    style: "numbered",
  },
  {
    id: "storage",
    titleKey: "warranty.section2Title",
    itemsKey: "warranty.section2Items",
    style: "numbered",
    ratesAfterIndex: 2,
  },
  {
    id: "liability",
    titleKey: "warranty.section3Title",
    itemsKey: "warranty.section3Items",
    style: "numbered",
  },
  {
    id: "exclusions",
    titleKey: "warranty.section4Title",
    itemsKey: "warranty.section4Items",
    style: "numbered",
  },
  {
    id: "refusal",
    titleKey: "warranty.section5Title",
    introKey: "warranty.section5Intro",
    itemsKey: "warranty.section5Items",
    style: "dot",
  },
] as const;

type WarrantyRate = {
  id: string;
  labelKey: string;
  priceKey: string;
};

export const WARRANTY_STORAGE_RATES: readonly WarrantyRate[] = [
  {
    id: "compact",
    labelKey: "warranty.rateCompactLabel",
    priceKey: "warranty.rateCompactPrice",
  },
  {
    id: "standard",
    labelKey: "warranty.rateStandardLabel",
    priceKey: "warranty.rateStandardPrice",
  },
  {
    id: "oversized",
    labelKey: "warranty.rateOversizedLabel",
    priceKey: "warranty.rateOversizedPrice",
  },
] as const;
