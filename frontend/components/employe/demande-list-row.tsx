import Link from "next/link";
import { Calendar, ChevronRight, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  formatPrice,
  formatShortDateTime,
  formatStatutDemande,
} from "@/lib/format";
import type { DemandeReservation } from "@/lib/types";

interface DemandeListRowProps {
  demande: DemandeReservation;
  isLast?: boolean;
}

function statutVariant(
  statut: DemandeReservation["statut"],
): "warning" | "success" | "error" {
  switch (statut) {
    case "en_attente":
      return "warning";
    case "acceptee":
      return "success";
    case "refusee":
      return "error";
  }
}

export function DemandeListRow({ demande, isLast }: DemandeListRowProps) {
  const href =
    demande.statut === "acceptee"
      ? `/employe/reservations/${demande.id}`
      : `/employe/demandes/${demande.id}`;

  return (
    <>
      <Link
        href={href}
        className="group flex min-h-[56px] items-center gap-2 px-4 py-3.5 transition-colors hover:bg-accent/40 active:bg-accent/60 focus-visible:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 sm:gap-3"
      >
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate font-medium text-[0.9375rem] text-foreground">
            {demande.nom_manifestation}
          </p>
          <p className="flex items-center gap-1.5 truncate text-muted-foreground text-xs">
            <Calendar className="size-3 shrink-0" aria-hidden />
            {formatShortDateTime(demande.date_debut)}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground text-xs sm:hidden">
            <span className="truncate">{demande.salle_nom}</span>
            <Badge variant={statutVariant(demande.statut)} className="text-xs">
              {formatStatutDemande(demande.statut)}
            </Badge>
          </p>
        </div>

        <div className="hidden min-w-0 shrink-0 flex-col items-end gap-1 sm:flex sm:max-w-[140px]">
          <span className="truncate text-muted-foreground text-xs">
            {demande.salle_nom}
          </span>
          <span className="flex items-center gap-1 truncate text-muted-foreground text-xs">
            <User className="size-3 shrink-0" aria-hidden />
            {demande.demandeur_nom}
          </span>
        </div>

        <div className="hidden shrink-0 flex-col items-end gap-1 md:flex">
          <Badge variant={statutVariant(demande.statut)} className="text-xs">
            {formatStatutDemande(demande.statut)}
          </Badge>
          <span className="font-mono text-muted-foreground text-xs">
            {formatPrice(demande.prix_total)}
          </span>
        </div>

        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
          aria-hidden
        />
      </Link>
      {!isLast && <div className="mx-4 border-b border-border/50" aria-hidden />}
    </>
  );
}
