import Link from "next/link";
import { Calendar, ChevronRight, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  formatKeyTrackingStatus,
  getKeyTrackingStatus,
  keyTrackingBadgeVariant,
} from "@/lib/suivi-status";
import { formatShortDateTime } from "@/lib/format";
import type { DemandeReservation, SuiviCles } from "@/lib/types";

interface ReservationListRowProps {
  demande: DemandeReservation;
  suivi: SuiviCles | null;
  isLast?: boolean;
}

export function ReservationListRow({
  demande,
  suivi,
  isLast,
}: ReservationListRowProps) {
  const status = suivi ? getKeyTrackingStatus(suivi) : "pending_handover";

  return (
    <>
      <Link
        href={`/gardien/reservations/${demande.id}`}
        className="group flex min-h-[64px] items-center gap-2 px-4 py-3.5 transition-colors hover:bg-accent/40 active:bg-accent/60 focus-visible:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 sm:gap-3"
      >
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate font-medium text-[0.9375rem] text-foreground">
            {demande.nom_manifestation}
          </p>
          <p className="flex items-center gap-1.5 truncate text-muted-foreground text-xs">
            <Calendar className="size-3 shrink-0" aria-hidden />
            {formatShortDateTime(demande.date_debut)}
            <span aria-hidden>→</span>
            {formatShortDateTime(demande.date_fin)}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground text-xs sm:hidden">
            <User className="size-3 shrink-0" aria-hidden />
            <span className="truncate">{demande.demandeur_nom}</span>
          </p>
        </div>

        <div className="hidden min-w-0 shrink-0 flex-col items-end gap-1 sm:flex sm:max-w-[160px]">
          <span className="flex items-center gap-1 truncate text-muted-foreground text-xs">
            <User className="size-3 shrink-0" aria-hidden />
            {demande.demandeur_nom}
          </span>
          <span className="truncate font-mono text-muted-foreground text-xs">
            n° {demande.id}
          </span>
        </div>

        <div className="hidden shrink-0 sm:flex">
          <Badge variant={keyTrackingBadgeVariant(status)} className="text-xs">
            {formatKeyTrackingStatus(status)}
          </Badge>
        </div>

        <Badge
          variant={keyTrackingBadgeVariant(status)}
          className="shrink-0 text-xs sm:hidden"
        >
          {formatKeyTrackingStatus(status)}
        </Badge>

        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
          aria-hidden
        />
      </Link>
      {!isLast && <div className="mx-4 border-b border-border/50" aria-hidden />}
    </>
  );
}
