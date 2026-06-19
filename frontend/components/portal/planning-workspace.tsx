"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { fetchPlanningClient } from "@/lib/api";
import { isRangeTimeValid, parseDateRange, type SerializedDateRange } from "@/lib/dates";
import type { DateRange, SallePlanning } from "@/lib/types";

import { DateRangeCalendar } from "./date-range-calendar";
import { PlanningResults } from "./planning-results";

interface PlanningWorkspaceProps {
  initialSalles: SallePlanning[];
  initialError: string | null;
  initialRange: SerializedDateRange;
}

export function PlanningWorkspace({
  initialSalles,
  initialError,
  initialRange,
}: PlanningWorkspaceProps) {
  const [range, setRange] = useState<DateRange>(() =>
    parseDateRange(initialRange),
  );
  const [salles, setSalles] = useState<SallePlanning[]>(initialSalles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const isMount = useRef(true);

  const loadPlanning = useCallback(async (currentRange: DateRange) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlanningClient(currentRange);
      setSalles(data);
    } catch (err) {
      setSalles([]);
      setError(
        err instanceof Error
          ? err.message
          : "Vérifiez que le serveur backend est démarré.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isMount.current) {
      isMount.current = false;
      return;
    }

    if (!isRangeTimeValid(range)) {
      return;
    }

    const timer = setTimeout(() => {
      void loadPlanning(range);
    }, 300);
    return () => clearTimeout(timer);
  }, [range, loadPlanning]);

  return (
    <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-10">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <DateRangeCalendar range={range} onRangeChange={setRange} />
      </aside>

      <section>
        <PlanningResults
          salles={salles}
          range={range}
          loading={loading}
          error={error}
        />
      </section>
    </div>
  );
}
