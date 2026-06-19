import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildDemandeUrl, buildPlanningUrl } from "@/lib/api";
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
  const planningUrl = buildPlanningUrl(slotRange);
  const demandeUrl = buildDemandeUrl(salleId, slotRange);

  return (
    <section className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          {estLibre === true && (
            <Badge variant="success" size="lg">
              Libre
            </Badge>
          )}
          {estLibre === false && (
            <Badge variant="outline" size="lg" className="border-planning-occupe/40 text-planning-occupe-fg">
              Occupée
            </Badge>
          )}
          <p className="break-words font-mono text-foreground text-sm">{slotLabel}</p>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
          {estLibre === true && (
            <Button
              render={<Link href={demandeUrl} />}
              size="lg"
              className="min-h-11 w-full rounded-lg sm:w-auto"
            >
              Réserver
            </Button>
          )}
          <Button
            render={<Link href={planningUrl} />}
            variant={estLibre === false ? "outline" : estLibre === true ? "outline" : "default"}
            size="lg"
            className="min-h-11 w-full rounded-lg sm:w-auto"
          >
            <ArrowLeft aria-hidden />
            {estLibre === false ? "Autre créneau" : "Retour au planning"}
          </Button>
        </div>
      </div>
    </section>
  );
}
