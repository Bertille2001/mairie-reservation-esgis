import type { SallePlanning } from "@/lib/types";
import { fetchPlanningServer } from "@/lib/api";
import {
  parseQueryDateRange,
  serializeDateRange,
  todayRange,
} from "@/lib/dates";
import { PLANNING_LOAD_ERROR } from "@/lib/errors";

import { PlanningWorkspace } from "./planning-workspace";

interface PlanningBoardLoaderProps {
  debut?: string;
  fin?: string;
}

export async function PlanningBoardLoader({
  debut,
  fin,
}: PlanningBoardLoaderProps) {
  const initialRange = parseQueryDateRange(debut, fin) ?? todayRange();
  let initialSalles: SallePlanning[] = [];
  let initialError: string | null = null;

  try {
    initialSalles = await fetchPlanningServer(initialRange);
  } catch {
    initialError = PLANNING_LOAD_ERROR;
  }

  return (
    <PlanningWorkspace
      initialSalles={initialSalles}
      initialError={initialError}
      initialRange={serializeDateRange(initialRange)}
    />
  );
}
