import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatDateTimeFr } from "@/lib/format";
import {
  formatKeyTrackingStatus,
  getKeyTrackingStatus,
  keyTrackingBadgeVariant,
  type KeyTrackingStatus,
} from "@/lib/suivi-status";
import { cn } from "@/lib/utils";
import type { SuiviCles } from "@/lib/types";

interface KeyTrackingTimelineProps {
  suivi: SuiviCles;
}

const STEPS = [
  {
    key: "handover" as const,
    title: "Remise",
    getScheduled: (s: SuiviCles) => s.date_remise_prevue,
    getActual: (s: SuiviCles) => s.date_remise_reelle,
    isDone: (s: SuiviCles) => Boolean(s.date_remise_reelle),
  },
  {
    key: "usage" as const,
    title: "Créneau",
    getScheduled: (s: SuiviCles) => s.date_restitution_prevue,
    getActual: () => null,
    isDone: (s: SuiviCles) => Boolean(s.date_remise_reelle),
  },
  {
    key: "return" as const,
    title: "Restitution",
    getScheduled: (s: SuiviCles) => s.date_restitution_prevue,
    getActual: (s: SuiviCles) => s.date_restitution_reelle,
    isDone: (s: SuiviCles) => s.cles_rendues === true,
  },
];

function stepState(
  index: number,
  suivi: SuiviCles,
  status: KeyTrackingStatus,
): "done" | "current" | "upcoming" {
  const step = STEPS[index];
  if (step.isDone(suivi) && (index < 2 || suivi.cles_rendues === true)) {
    return "done";
  }
  if (index === 0 && (status === "pending_handover" || status === "overdue_handover")) {
    return "current";
  }
  if (index === 1 && status === "in_use") {
    return "current";
  }
  if (index === 2 && (status === "in_use" || status === "overdue_return")) {
    return "current";
  }
  if (index === 2 && status === "returned") {
    return "done";
  }
  if (step.isDone(suivi)) return "done";
  return "upcoming";
}

export function KeyTrackingTimeline({ suivi }: KeyTrackingTimelineProps) {
  const status = getKeyTrackingStatus(suivi);

  return (
    <section
      className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5"
      aria-label="Suivi des clés"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <ol className="flex flex-1 items-center gap-1 sm:gap-2">
          {STEPS.map((step, index) => {
            const state = stepState(index, suivi, status);
            const isLast = index === STEPS.length - 1;

            return (
              <li key={step.key} className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md border text-xs font-medium sm:size-8",
                    state === "done" &&
                      "border-success/40 bg-success/8 text-success-fg",
                    state === "current" &&
                      "border-primary/40 bg-primary/8 text-primary",
                    state === "upcoming" &&
                      "border-border/60 bg-muted/50 text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {state === "done" ? (
                    <Check className="size-3.5 sm:size-4" strokeWidth={2} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "hidden truncate text-xs font-medium sm:inline",
                    state === "current" ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </span>
                {!isLast && (
                  <div
                    className={cn(
                      "h-px min-w-2 flex-1",
                      state === "done" ? "bg-success/30" : "bg-border/60",
                    )}
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ol>
        <Badge variant={keyTrackingBadgeVariant(status)} className="shrink-0 text-xs">
          {formatKeyTrackingStatus(status)}
        </Badge>
      </div>

      <dl className="grid gap-2 text-xs sm:grid-cols-2">
        {STEPS.map((step) => {
          const scheduled = step.getScheduled(suivi);
          const actual = step.getActual(suivi);
          if (!scheduled && !actual) return null;

          return (
            <div key={step.key} className="min-w-0">
              <dt className="text-muted-foreground">{step.title}</dt>
              <dd className="mt-0.5 font-mono text-foreground">
                {actual ? formatDateTimeFr(actual) : formatDateTimeFr(scheduled!)}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
