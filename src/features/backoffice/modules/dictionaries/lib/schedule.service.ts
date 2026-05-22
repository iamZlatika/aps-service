import { type ScheduleGroup } from "@/features/backoffice/modules/dictionaries/types.ts";
import { type Schedule, WEEK_DAYS } from "@/shared/types";

export function mapScheduleGroupsToSchedule(groups: ScheduleGroup[]): Schedule {
  const result: Schedule = {
    mon: null,
    tue: null,
    wed: null,
    thu: null,
    fri: null,
    sat: null,
    sun: null,
  };

  for (const group of groups) {
    const fromIdx = WEEK_DAYS.indexOf(group.fromDay);
    const toIdx = WEEK_DAYS.indexOf(group.toDay);
    const start = Math.min(fromIdx, toIdx);
    const end = Math.max(fromIdx, toIdx);

    for (let i = start; i <= end; i++) {
      result[WEEK_DAYS[i]] = { from: group.from, to: group.to };
    }
  }

  return result;
}

export function mapScheduleToGroups(schedule: Schedule): ScheduleGroup[] {
  const groups: ScheduleGroup[] = [];
  let i = 0;

  while (i < WEEK_DAYS.length) {
    const day = WEEK_DAYS[i];
    const slot = schedule[day];

    if (!slot) {
      i++;
      continue;
    }

    let j = i;
    while (j + 1 < WEEK_DAYS.length) {
      const nextSlot = schedule[WEEK_DAYS[j + 1]];
      if (nextSlot && nextSlot.from === slot.from && nextSlot.to === slot.to) {
        j++;
      } else {
        break;
      }
    }

    groups.push({
      fromDay: WEEK_DAYS[i],
      toDay: WEEK_DAYS[j],
      from: slot.from,
      to: slot.to,
    });

    i = j + 1;
  }

  return groups;
}
