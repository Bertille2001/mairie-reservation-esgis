import Link from "next/link";
import { ArrowRight, CalendarX, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildDemandeUrl } from "@/lib/api";
import { formatSlotLabel } from "@/lib/dates";
import type { DateRange } from "@/lib/types";

interface SalleSlotSummaryProps {
  salleId: number;
  slotRange: DateRange;
  estLibre: boolean | null;
}

export function SalleSlotSummary({
  salleId,
  slotRange,
  estLibre,
}: SalleSlotSummaryProps) {
  const slotLabel = formatSlotLabel(slotRange);
  const canReserve = estLibre !== false;
  const demandeUrl = buildDemandeUrl(salleId, slotRange);

  return (
    <section className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-2">
          {estLibre === true && (
            <p className="flex items-center gap-2 font-medium text-sm text-success-fg">
              <CheckCircle2 className="size-4 shrink-0" aria-hidden />
              Disponible sur votre créneau
            </p>
          )}
          {estLibre === false && (
            <p className="flex items-center gap-2 font-medium text-planning-occupe-fg text-sm">
              <CalendarX className="size-4 shrink-0" aria-hidden />
              Occupée sur ce créneau
            </p>
          )}
          {estLibre === null && (
            <p className="flex items-center gap-2 font-medium text-muted-foreground text-sm">
              <CalendarX className="size-4 shrink-0" aria-hidden />
              Créneau sélectionné
            </p>
          )}
          <p className="break-words font-mono text-foreground text-sm">{slotLabel}</p>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-md focus-visible:text-foreground focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            Modifier le créneau sur le planning
          </Link>
        </div>

        {canReserve ? (
          <Button
            render={<Link href={demandeUrl} />}
            size="lg"
            className="min-h-11 w-full shrink-0 rounded-lg lg:w-auto"
          >
            Réserver pour ce créneau
            <ArrowRight aria-hidden />
          </Button>
        ) : (
          <Button
            render={<Link href="/" />}
            variant="outline"
            size="lg"
            className="min-h-11 w-full shrink-0 rounded-lg lg:w-auto"
          >
            Choisir un autre créneau
          </Button>
        )}
      </div>
    </section>
  );
}
