"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { fetchPlanningClient } from "@/lib/api";
import {
  isRangeTimeValid,
  parseDateRange,
  rangeToApiParams,
  type SerializedDateRange,
} from "@/lib/dates";
import { PLANNING_LOAD_ERROR } from "@/lib/errors";
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
  const router = useRouter();
  const pathname = usePathname();
  const [range, setRange] = useState<DateRange>(() =>
    parseDateRange(initialRange),
  );
  const [salles, setSalles] = useState<SallePlanning[]>(initialSalles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const skipInitialFetch = useRef(true);

  const loadPlanning = useCallback(async (currentRange: DateRange) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlanningClient(currentRange);
      setSalles(data);
    } catch {
      setSalles([]);
      setError(PLANNING_LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }

    if (!isRangeTimeValid(range)) {
      return;
    }

    const { date_debut, date_fin } = rangeToApiParams(range);
    const params = new URLSearchParams(window.location.search);
    if (params.get("debut") !== date_debut || params.get("fin") !== date_fin) {
      params.set("debut", date_debut);
      params.set("fin", date_fin);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    const timer = setTimeout(() => {
      void loadPlanning(range);
    }, 300);
    return () => clearTimeout(timer);
  }, [range, loadPlanning, pathname, router]);

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
