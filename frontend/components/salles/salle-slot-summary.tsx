import Link from "next/link";
import { ArrowLeft, CalendarX, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildPlanningUrl } from "@/lib/api";
import { formatSlotLabel } from "@/lib/dates";
import type { DateRange } from "@/lib/types";

interface SalleSlotSummaryProps {
  slotRange: DateRange;
  estLibre: boolean | null;
}

export function SalleSlotSummary({
  slotRange,
  estLibre,
}: SalleSlotSummaryProps) {
  const slotLabel = formatSlotLabel(slotRange);
  const planningUrl = buildPlanningUrl(slotRange);

  return (
    <section className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          {estLibre === true && (
            <p className="flex items-center gap-2 font-medium text-sm text-success-fg">
              <CheckCircle2 className="size-4 shrink-0" aria-hidden />
              Libre
            </p>
          )}
          {estLibre === false && (
            <p className="flex items-center gap-2 font-medium text-planning-occupe-fg text-sm">
              <CalendarX className="size-4 shrink-0" aria-hidden />
              Occupée
            </p>
          )}
          {estLibre === null && (
            <p className="font-medium text-muted-foreground text-sm">Créneau</p>
          )}
          <p className="break-words font-mono text-foreground text-sm">{slotLabel}</p>
        </div>

        <Button
          render={<Link href={planningUrl} />}
          variant={estLibre === false ? "outline" : "default"}
          size="lg"
          className="min-h-11 w-full shrink-0 rounded-lg sm:w-auto"
        >
          <ArrowLeft aria-hidden />
          {estLibre === false ? "Autre créneau" : "Retour au planning"}
        </Button>
      </div>
    </section>
  );
}
