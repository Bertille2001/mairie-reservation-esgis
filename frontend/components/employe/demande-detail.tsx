import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  formatDateTimeFr,
  formatPrice,
  formatStatutDemande,
  formatTypeDemandeur,
} from "@/lib/format";
import type { DemandeReservation } from "@/lib/types";

interface DemandeDetailProps {
  demande: DemandeReservation;
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

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-muted-foreground text-sm">{label}</dt>
      <dd className="font-medium text-foreground text-sm sm:text-right">{value}</dd>
    </div>
  );
}

export function DemandeDetail({ demande }: DemandeDetailProps) {
  return (
    <section className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-semibold text-base text-foreground tracking-[-0.01em]">
            Demande n° {demande.id}
          </h2>
          <p className="text-muted-foreground text-sm">
            Soumise le {formatDateTimeFr(demande.date_soumission)}
          </p>
        </div>
        <Badge variant={statutVariant(demande.statut)}>
          {formatStatutDemande(demande.statut)}
        </Badge>
      </div>

      <dl className="divide-y divide-border/50">
        <div className="space-y-3 py-3 first:pt-0">
          <DetailRow label="Manifestation" value={demande.nom_manifestation} />
          <DetailRow label="Salle" value={demande.salle_nom} />
          <DetailRow
            label="Créneau"
            value={
              <>
                {formatDateTimeFr(demande.date_debut)}
                <span className="block text-muted-foreground font-normal text-xs">
                  jusqu&apos;au {formatDateTimeFr(demande.date_fin)}
                </span>
              </>
            }
          />
          <DetailRow
            label="Participants"
            value={`${demande.nb_personnes} personnes`}
          />
        </div>

        <div className="space-y-3 py-3">
          <DetailRow label="Demandeur" value={demande.demandeur_nom} />
          <DetailRow label="E-mail" value={demande.demandeur_email} />
          <DetailRow
            label="Type"
            value={formatTypeDemandeur(demande.type_demandeur)}
          />
        </div>

        <div className="space-y-3 py-3">
          <DetailRow
            label="Prix estimé"
            value={
              <span className="font-mono">{formatPrice(demande.prix_total)}</span>
            }
          />
          {demande.statut === "refusee" && demande.raison_refus && (
            <DetailRow
              label="Motif du refus"
              value={
                <span className="text-destructive">{demande.raison_refus}</span>
              }
            />
          )}
        </div>
      </dl>
    </section>
  );
}
