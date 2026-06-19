import type { SuiviCles } from "./types";

export type KeyTrackingStatus =
  | "pending_handover"
  | "overdue_handover"
  | "in_use"
  | "overdue_return"
  | "returned";

export function getKeyTrackingStatus(
  suivi: SuiviCles,
  now: Date = new Date(),
): KeyTrackingStatus {
  if (suivi.cles_rendues === true) {
    return "returned";
  }

  const handoverDue = new Date(suivi.date_remise_prevue);
  const restitutionDue = new Date(suivi.date_restitution_prevue);

  if (!suivi.date_remise_reelle) {
    if (now > handoverDue) {
      return "overdue_handover";
    }
    return "pending_handover";
  }

  if (now > restitutionDue) {
    return "overdue_return";
  }

  return "in_use";
}

export function formatKeyTrackingStatus(status: KeyTrackingStatus): string {
  switch (status) {
    case "pending_handover":
      return "Remise prévue";
    case "overdue_handover":
      return "Remise en retard";
    case "in_use":
      return "Clés en circulation";
    case "overdue_return":
      return "Restitution en retard";
    case "returned":
      return "Clés rendues";
  }
}

export function keyTrackingBadgeVariant(
  status: KeyTrackingStatus,
): "warning" | "info" | "error" | "success" {
  switch (status) {
    case "pending_handover":
      return "warning";
    case "overdue_handover":
      return "error";
    case "in_use":
      return "info";
    case "overdue_return":
      return "error";
    case "returned":
      return "success";
  }
}

const MS_PER_DAY = 86_400_000;

/** Réservations nécessitant l'attention du gardien (hors clôturées) */
export function needsGardienAttention(
  suivi: SuiviCles,
  now: Date = new Date(),
): boolean {
  const status = getKeyTrackingStatus(suivi, now);
  if (status === "returned") return false;
  if (status === "overdue_handover" || status === "overdue_return") return true;

  if (status === "pending_handover") {
    const start = new Date(suivi.date_remise_prevue).getTime();
    return start - now.getTime() <= 7 * MS_PER_DAY;
  }

  if (status === "in_use") {
    const end = new Date(suivi.date_restitution_prevue).getTime();
    return end - now.getTime() <= MS_PER_DAY;
  }

  return false;
}

export type KeyTrackingStep = 1 | 2 | 3;

export function getCurrentKeyTrackingStep(
  suivi: SuiviCles,
  now: Date = new Date(),
): KeyTrackingStep {
  const status = getKeyTrackingStatus(suivi, now);
  if (status === "returned") return 3;
  if (status === "in_use" || status === "overdue_return") return 3;
  return 1;
}

export function isHandoverStepComplete(suivi: SuiviCles): boolean {
  return Boolean(suivi.date_remise_reelle);
}

export function isReturnStepComplete(suivi: SuiviCles): boolean {
  return suivi.cles_rendues === true;
}
