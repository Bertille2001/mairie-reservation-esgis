import type { SallePlanning } from "@/lib/types";
import { fetchPlanningServer } from "@/lib/api";
import {
  serializeDateRange,
  todayRange,
} from "@/lib/dates";

import { PlanningWorkspace } from "./planning-workspace";

export async function PlanningBoardLoader() {
  const initialRange = todayRange();
  let initialSalles: SallePlanning[] = [];
  let initialError: string | null = null;

  try {
    initialSalles = await fetchPlanningServer(initialRange);
  } catch (err) {
    initialError =
      err instanceof Error
        ? err.message
        : "Vérifiez que le serveur backend est démarré.";
  }

  return (
    <PlanningWorkspace
      initialSalles={initialSalles}
      initialError={initialError}
      initialRange={serializeDateRange(initialRange)}
    />
  );
}
