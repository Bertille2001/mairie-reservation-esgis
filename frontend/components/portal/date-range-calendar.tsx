"use client";

import { useCallback } from "react";
import { fr } from "react-day-picker/locale";
import type { DateRange as DayPickerRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  formatRangeLabel,
  normalizeRange,
  thisWeekRange,
  todayRange,
} from "@/lib/dates";
import type { DateRange } from "@/lib/types";

import { TimeRangeFields } from "./time-range-fields";

interface DateRangeCalendarProps {
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
}

function toDayPickerRange(range: DateRange): DayPickerRange {
  return { from: range.start, to: range.end };
}

function fromDayPickerRange(selected: DayPickerRange | undefined): DateRange | null {
  if (!selected?.from) return null;
  const end = selected.to ?? selected.from;
  return normalizeRange(selected.from, end);
}

export function DateRangeCalendar({ range, onRangeChange }: DateRangeCalendarProps) {
  const handleSelect = useCallback(
    (selected: DayPickerRange | undefined) => {
      const next = fromDayPickerRange(selected);
      if (next) onRangeChange(next);
    },
    [onRangeChange],
  );

  return (
    <div className="space-y-5 rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5">
      <div className="space-y-1">
        <h2 className="font-semibold text-base text-foreground tracking-[-0.02em]">
          Choisir une période
        </h2>
        <p className="text-muted-foreground text-sm">{formatRangeLabel(range)}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="min-h-11 rounded-lg"
          onClick={() => onRangeChange(todayRange())}
        >
          Aujourd&apos;hui
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="min-h-11 rounded-lg"
          onClick={() => onRangeChange(thisWeekRange())}
        >
          Cette semaine
        </Button>
      </div>

      <Calendar
        mode="range"
        locale={fr}
        selected={toDayPickerRange(range)}
        onSelect={handleSelect}
        numberOfMonths={1}
        disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
        className="mx-auto w-full max-w-full rounded-lg bg-surface-grouped p-2 [--cell-size:--spacing(11)] sm:[--cell-size:--spacing(9)]"
      />

      <TimeRangeFields range={range} onRangeChange={onRangeChange} />

      <div className="flex flex-wrap gap-4 border-t border-border/50 pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-success" aria-hidden />
          Libre
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-planning-occupe-fg" aria-hidden />
          Occupé
        </span>
      </div>
    </div>
  );
}
