import Link from "next/link";
import { ArrowLeft, ArrowRight, KeyRound, MapPin } from "lucide-react";

import { SalleSlotSummary } from "@/components/salles/salle-slot-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { buildDemandeUrl } from "@/lib/api";
import { formatCapacite, formatPrice, formatSurface } from "@/lib/format";
import type { DateRange, SalleDetail } from "@/lib/types";

interface SalleDetailContentProps {
  salle: SalleDetail;
  slotRange?: DateRange | null;
  estLibreSurCreneau?: boolean | null;
}

function DetailItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={mono ? "font-mono text-sm text-foreground" : "text-sm text-foreground"}>
        {value}
      </p>
    </div>
  );
}

export function SalleDetailContent({
  salle,
  slotRange = null,
  estLibreSurCreneau = null,
}: SalleDetailContentProps) {
  const fromPlanning = slotRange !== null;
  const demandeUrl = buildDemandeUrl(salle.id);
  const backHref = fromPlanning ? "/" : "/salles";
  const backLabel = fromPlanning ? "Retour au planning" : "Toutes les salles";

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <Button
          render={<Link href={backHref} />}
          variant="ghost"
          size="sm"
          className="-ml-2 min-h-11 rounded-lg"
        >
          <ArrowLeft aria-hidden />
          {backLabel}
        </Button>

        <div className="space-y-2">
          <h1 className="font-semibold text-[1.75rem] text-foreground leading-tight tracking-[-0.03em] md:text-[2rem]">
            {salle.nom}
          </h1>
          <p className="flex items-start gap-2 break-words text-muted-foreground text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
            {salle.adresse}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={salle.est_payante ? "outline" : "secondary"}>
            {salle.est_payante ? "Salle payante" : "Salle gratuite"}
          </Badge>
          {salle.a_gardien && (
            <Badge variant="outline" className="gap-1.5">
              <KeyRound className="size-3" aria-hidden />
              Gardien sur place
            </Badge>
          )}
        </div>
      </div>

      {fromPlanning && slotRange && (
        <SalleSlotSummary
          salleId={salle.id}
          slotRange={slotRange}
          estLibre={estLibreSurCreneau}
        />
      )}

      <section className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5">
        <h2 className="mb-4 font-semibold text-base text-foreground tracking-[-0.01em]">
          Caractéristiques
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem
            label="Surface"
            value={formatSurface(salle.surface_m2)}
            mono
          />
          <DetailItem
            label="Capacité"
            value={formatCapacite(salle.capacite_min, salle.capacite_max)}
          />
          <DetailItem
            label="Tarif horaire"
            value={
              salle.est_payante
                ? `${formatPrice(salle.prix_heure)} / h`
                : "Gratuit"
            }
            mono={salle.est_payante}
          />
          <DetailItem
            label="Accueil"
            value={salle.a_gardien ? "Gardien de salle" : "Remise des clés à la mairie"}
          />
        </div>
      </section>

      <section className="rounded-xl border border-border/60 bg-surface-elevated shadow-panel">
        <div className="border-b border-border/50 px-5 py-4">
          <h2 className="font-semibold text-base text-foreground tracking-[-0.01em]">
            Équipement fixe
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Inclus avec la salle
          </p>
        </div>
        {salle.appareils_fixes.length === 0 ? (
          <p className="px-5 py-6 text-muted-foreground text-sm">
            Aucun équipement fixe renseigné.
          </p>
        ) : (
          <ul className="divide-y divide-border/50">
            {salle.appareils_fixes.map((nom) => (
              <li key={nom} className="px-5 py-3.5 text-sm text-foreground">
                {nom}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-border/60 bg-surface-elevated shadow-panel">
        <div className="border-b border-border/50 px-5 py-4">
          <h2 className="font-semibold text-base text-foreground tracking-[-0.01em]">
            Matériel en location
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Optionnel, à demander lors de la réservation
          </p>
        </div>
        {salle.appareils_louables.length === 0 ? (
          <p className="px-5 py-6 text-muted-foreground text-sm">
            Aucun matériel louable pour cette salle.
          </p>
        ) : (
          <ul className="divide-y divide-border/50">
            {salle.appareils_louables.map((appareil) => (
              <li
                key={appareil.id}
                className="flex items-start justify-between gap-4 px-4 py-3.5 sm:px-5"
              >
                <span className="min-w-0 flex-1 break-words text-sm text-foreground">
                  {appareil.nom}
                </span>
                <span className="shrink-0 font-mono text-muted-foreground text-sm">
                  {formatPrice(appareil.prix)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {!fromPlanning && (
        <>
          <Separator />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-muted-foreground text-sm">
              Déposez une demande de réservation. Un agent municipal la traitera
              sous quelques jours ouvrés.
            </p>
            <Button
              render={<Link href={demandeUrl} />}
              size="lg"
              className="min-h-11 w-full rounded-lg sm:w-auto"
            >
              Réserver cette salle
              <ArrowRight aria-hidden />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
