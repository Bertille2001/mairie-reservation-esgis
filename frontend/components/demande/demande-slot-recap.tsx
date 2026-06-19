import Link from "next/link";
import { Calendar, MapPin, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";

interface DemandeSlotRecapProps {
  salleName: string;
  slotLabel: string;
  capaciteLabel?: string;
  salleId: number;
  sticky?: boolean;
  className?: string;
}

export function DemandeSlotRecap({
  salleName,
  slotLabel,
  capaciteLabel,
  salleId,
  sticky = true,
  className,
}: DemandeSlotRecapProps) {
  return (
    <aside
      className={cn(
        "rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5",
        sticky &&
          "sticky top-[calc(env(safe-area-inset-top,0px)+3.25rem)] z-20 sm:top-[calc(env(safe-area-inset-top,0px)+3.5rem)]",
        className,
      )}
      aria-label="Récapitulatif du créneau sélectionné"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-foreground text-xs uppercase tracking-[0.06em]">
          Créneau confirmé
        </p>
        <Link
          href="/"
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-muted-foreground text-xs underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-md focus-visible:text-foreground focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          <Pencil className="size-3.5" aria-hidden />
          Modifier
        </Link>
      </div>

      <div className="mt-3 space-y-2">
        <p className="flex items-start gap-2 font-medium text-foreground text-sm">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="min-w-0 break-words">{salleName}</span>
        </p>
        <p className="flex items-start gap-2 break-words font-mono text-foreground text-sm">
          <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          {slotLabel}
        </p>
        {capaciteLabel && (
          <p className="pl-6 text-muted-foreground text-xs">{capaciteLabel}</p>
        )}
      </div>

      <Link
        href={`/salles/${salleId}`}
        className="mt-3 inline-flex min-h-11 items-center text-muted-foreground text-xs underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-md focus-visible:text-foreground focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
      >
        Voir la fiche salle
      </Link>
    </aside>
  );
}
