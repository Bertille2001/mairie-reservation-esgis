import { DemandeForm } from "@/components/demande/demande-form";
import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";
import { fetchSallesServer } from "@/lib/api";
import { parseQueryDateRange } from "@/lib/dates";
import type { SalleDetail } from "@/lib/types";

export const metadata = {
  title: "Demande de réservation — Mairie de Lomé",
  description:
    "Déposez votre demande de réservation d'une salle municipale à Lomé.",
};

interface DemandePageProps {
  searchParams: Promise<{
    salle?: string;
    debut?: string;
    fin?: string;
  }>;
}

export default async function DemandePage({ searchParams }: DemandePageProps) {
  const { salle, debut, fin } = await searchParams;
  const initialSalleId = salle ? Number(salle) : null;
  const validSalleId =
    initialSalleId !== null && !Number.isNaN(initialSalleId)
      ? initialSalleId
      : null;
  const initialSlotRange = parseQueryDateRange(debut, fin);
  const slotLocked = initialSlotRange !== null;

  let salles: SalleDetail[] = [];
  let error: string | null = null;

  try {
    salles = await fetchSallesServer();
  } catch {
    error = "Impossible de charger les salles.";
  }

  return (
    <div className="flex min-h-full flex-col overflow-x-clip bg-background">
      <PortalHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <section className="space-y-3">
          <h1 className="font-semibold text-[1.75rem] text-foreground leading-tight tracking-[-0.03em] text-balance md:text-[2rem]">
            Déposer une demande de réservation
          </h1>
          <p className="text-[0.9375rem] text-muted-foreground leading-relaxed">
            Complétez le formulaire ci-dessous. Votre demande sera examinée par
            un agent municipal.
          </p>
        </section>

        {error ? (
          <div className="rounded-xl border border-border/60 bg-surface-elevated px-6 py-10 text-center shadow-panel">
            <p className="font-medium text-foreground text-sm">{error}</p>
          </div>
        ) : salles.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-surface-elevated px-6 py-10 text-center shadow-panel">
            <p className="font-medium text-foreground text-sm">
              Aucune salle disponible pour le moment.
            </p>
          </div>
        ) : (
          <DemandeForm
            salles={salles}
            initialSalleId={validSalleId}
            initialSlotRange={initialSlotRange}
            slotLocked={slotLocked}
          />
        )}
      </main>

      <PortalFooter />
    </div>
  );
}
