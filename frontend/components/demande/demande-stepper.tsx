import { cn } from "@/lib/utils";

const JOURNEY_STEPS = [
  { number: 1, label: "Planning" },
  { number: 2, label: "Salle" },
  { number: 3, label: "Demande" },
] as const;

interface DemandeStepperProps {
  currentStep?: 1 | 2 | 3;
}

export function DemandeStepper({ currentStep = 3 }: DemandeStepperProps) {
  return (
    <nav aria-label="Progression de la réservation" className="w-full">
      <ol className="flex items-center gap-0">
        {JOURNEY_STEPS.map((step, index) => {
          const isComplete = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isLast = index === JOURNEY_STEPS.length - 1;

          return (
            <li
              key={step.number}
              className={cn("flex min-w-0 flex-1 items-center", isLast && "flex-none")}
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="flex min-w-0 flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md font-medium text-xs tabular-nums",
                    isComplete && "bg-primary/10 text-primary",
                    isCurrent && "bg-primary text-primary-foreground",
                    !isComplete && !isCurrent && "bg-muted text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {isComplete ? "✓" : step.number}
                </span>
                <span
                  className={cn(
                    "truncate text-center text-xs sm:text-left",
                    isCurrent ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mx-2 hidden h-px min-w-4 flex-1 sm:block",
                    isComplete ? "bg-primary/40" : "bg-border/60",
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const FORM_STEPS = [
  { number: 1, label: "Créneau" },
  { number: 2, label: "Informations" },
] as const;

interface DemandeFormStepsProps {
  creneauComplete: boolean;
}

export function DemandeFormSteps({ creneauComplete }: DemandeFormStepsProps) {
  return (
    <div
      className="flex gap-2 rounded-xl border border-border/60 bg-surface-elevated p-1 shadow-panel"
      role="group"
      aria-label="Étapes du formulaire"
    >
      {FORM_STEPS.map((step) => {
        const isComplete = step.number === 1 && creneauComplete;
        const isCurrent = step.number === 1 ? !creneauComplete : true;

        return (
          <div
            key={step.number}
            className={cn(
              "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-sm transition-colors",
              isComplete && "bg-surface-grouped text-muted-foreground",
              isCurrent && !isComplete && "bg-primary/8 font-medium text-foreground",
              step.number === 2 && creneauComplete && "bg-primary/8 font-medium text-foreground",
            )}
            aria-current={isCurrent ? "step" : undefined}
          >
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-md text-xs tabular-nums",
                isComplete
                  ? "bg-primary/15 text-primary"
                  : isCurrent || (step.number === 2 && creneauComplete)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
              )}
              aria-hidden
            >
              {isComplete ? "✓" : step.number}
            </span>
            <span className="truncate">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
