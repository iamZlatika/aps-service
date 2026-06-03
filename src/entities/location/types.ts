import { type WeekDay } from "@/shared/types";

export type DaySlot = { from: string; to: string };
export type Schedule = Record<WeekDay, DaySlot | null>;

export type Location = {
  id: number;
  name: string;
  cityRu: string;
  cityUa: string;
  districtRu: string;
  districtUa: string;
  streetRu: string;
  streetUa: string;
  building: string;
  addressRu: string;
  addressUa: string;
  phone: string;
  schedule: Schedule;
  scheduleDisplay: string;
};
