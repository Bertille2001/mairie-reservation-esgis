"use client";

import {
  CLOSING_HOUR,
  dateToTimeInputValue,
  isRangeTimeValid,
  OPENING_HOUR,
  updateRangeEndTime,
  updateRangeStartTime,
} from "@/lib/dates";
import type { DateRange } from "@/lib/types";

interface TimeRangeFieldsProps {
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  idPrefix?: string;
}

const timeMin = `${String(OPENING_HOUR).padStart(2, "0")}:00`;
const timeMax = `${String(CLOSING_HOUR).padStart(2, "0")}:00`;

const inputClassName =
  "min-h-11 w-full rounded-lg border border-border/60 bg-surface-grouped px-3 font-mono text-sm text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";

export function TimeRangeFields({
  range,
  onRangeChange,
  idPrefix = "planning",
}: TimeRangeFieldsProps) {
  const valid = isRangeTimeValid(range);

  return (
    <div className="space-y-3 border-t border-border/50 pt-4">
      <p className="font-medium text-foreground text-sm">Horaires</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5" htmlFor={`${idPrefix}-start-time`}>
          <span className="text-muted-foreground text-xs">Heure de début</span>
          <input
            id={`${idPrefix}-start-time`}
            type="time"
            min={timeMin}
            max={timeMax}
            step={900}
            value={dateToTimeInputValue(range.start)}
            onChange={(event) =>
              onRangeChange(updateRangeStartTime(range, event.target.value))
            }
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1.5" htmlFor={`${idPrefix}-end-time`}>
          <span className="text-muted-foreground text-xs">Heure de fin</span>
          <input
            id={`${idPrefix}-end-time`}
            type="time"
            min={timeMin}
            max={timeMax}
            step={900}
            value={dateToTimeInputValue(range.end)}
            onChange={(event) =>
              onRangeChange(updateRangeEndTime(range, event.target.value))
            }
            className={inputClassName}
          />
        </label>
      </div>
      {!valid && (
        <p className="text-destructive text-xs" role="alert">
          L&apos;heure de fin doit être postérieure à l&apos;heure de début.
        </p>
      )}
    </div>
  );
}
