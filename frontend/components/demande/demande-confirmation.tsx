"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DEMANDE_CONFIRMATION_KEY } from "@/lib/api";
import { formatSlotLabel, parseQueryDateRange } from "@/lib/dates";
import { formatPrice } from "@/lib/format";
import type { DemandeReservation } from "@/lib/types";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="break-words text-foreground text-sm sm:text-right">{value}</dd>
    </div>
  );
}

function readStoredDemande(expectedId: string | null): DemandeReservation | null {
  const raw = sessionStorage.getItem(DEMANDE_CONFIRMATION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as DemandeReservation;
    if (expectedId && String(parsed.id) !== expectedId) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function ConfirmationLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

/** True only after hydration — avoids reading sessionStorage during SSR/hydration. */
function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function DemandeConfirmation() {
  const searchParams = useSearchParams();
  const expectedId = searchParams.get("id");
  const isClient = useIsClient();

  if (!isClient) {
    return <ConfirmationLoading />;
  }

  const demande = readStoredDemande(expectedId);

  if (!demande) {
    return (
      <div className="rounded-xl border border-border/60 bg-surface-elevated px-6 py-10 text-center shadow-panel">
        <p className="font-medium text-foreground text-sm">
          Aucune demande récente à afficher.
        </p>
        <p className="mt-2 text-muted-foreground text-sm">
          Si vous venez de soumettre une demande, vérifiez votre e-mail de
          confirmation ou revenez au planning.
        </p>
        <Button
          render={<Link href="/" />}
          size="lg"
          className="mt-6 min-h-11 w-full rounded-lg sm:w-auto"
        >
          Retour au planning
        </Button>
      </div>
    );
  }

  const slotRange = parseQueryDateRange(demande.date_debut, demande.date_fin);
  const slotLabel = slotRange
    ? formatSlotLabel(slotRange)
    : `${demande.date_debut} – ${demande.date_fin}`;

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="flex items-center gap-2 font-medium text-sm text-success-fg">
              <CheckCircle2 className="size-4 shrink-0" aria-hidden />
              Demande enregistrée
            </p>
            <h2 className="font-semibold text-[1.5rem] text-foreground tracking-[-0.03em]">
              Demande n° {demande.id}
            </h2>
            <p className="max-w-xl text-muted-foreground text-sm leading-relaxed">
              Votre demande a été transmise à la mairie. Un agent municipal la
              traitera sous quelques jours ouvrés. Vous serez informé par e-mail
              à {demande.demandeur_email}.
            </p>
          </div>
          <Button
            render={<Link href="/" />}
            size="lg"
            className="min-h-11 w-full shrink-0 rounded-lg lg:w-auto"
          >
            Retour au planning
            <ArrowRight aria-hidden />
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5">
        <h3 className="mb-4 font-semibold text-base text-foreground tracking-[-0.01em]">
          Récapitulatif
        </h3>
        <dl className="divide-y divide-border/50">
          <div className="space-y-3 pb-3">
            <DetailRow label="Salle" value={demande.salle_nom} />
            <DetailRow label="Créneau" value={slotLabel} />
            <DetailRow label="Manifestation" value={demande.nom_manifestation} />
            <DetailRow
              label="Participants"
              value={`${demande.nb_personnes} personnes`}
            />
          </div>
          <div className="space-y-3 py-3">
            <DetailRow label="Demandeur" value={demande.demandeur_nom} />
            <DetailRow
              label="Type"
              value={
                demande.type_demandeur === "organisation"
                  ? "Organisation"
                  : "Particulier"
              }
            />
          </div>
          <div className="space-y-3 pt-3">
            <DetailRow
              label="Prix estimé"
              value={formatPrice(demande.prix_total)}
            />
            <DetailRow label="Statut" value="En attente de traitement" />
          </div>
        </dl>
      </section>

      <p className="text-muted-foreground text-xs">
        Cette demande ne peut plus être modifiée en ligne. Conservez le numéro
        de demande pour vos échanges avec la mairie.
      </p>
    </div>
  );
}
