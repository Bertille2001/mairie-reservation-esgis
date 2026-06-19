import { DemandeList } from "@/components/employe/demande-list";
import type { StatutDemande } from "@/lib/types";

export const metadata = {
  title: "Demandes en attente — Espace employé",
};

const VALID_STATUTS: StatutDemande[] = ["en_attente", "acceptee", "refusee"];

function parseStatut(value?: string): StatutDemande {
  if (value && VALID_STATUTS.includes(value as StatutDemande)) {
    return value as StatutDemande;
  }
  return "en_attente";
}

export default async function EmployePage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string }>;
}) {
  const params = await searchParams;
  const statut = parseStatut(params.statut);

  return (
    <div className="flex flex-col gap-8">
      <section className="max-w-3xl space-y-3">
        <h1 className="font-semibold text-[1.75rem] text-foreground leading-tight tracking-[-0.03em] md:text-[2.125rem]">
          File des demandes
        </h1>
        <p className="max-w-2xl text-[0.9375rem] text-muted-foreground leading-relaxed">
          Consultez et traitez les demandes de réservation. Les demandes
          acceptées sont accessibles via le suivi clés et paiement.
        </p>
      </section>

      <DemandeList initialStatut={statut} />
    </div>
  );
}
