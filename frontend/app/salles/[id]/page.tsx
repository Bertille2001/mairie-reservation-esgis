import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";
import { SalleDetailContent } from "@/components/salles/salle-detail-content";
import { fetchSalleDisponibiliteServer, fetchSalleServer } from "@/lib/api";
import { parseQueryDateRange } from "@/lib/dates";

interface SallePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ debut?: string; fin?: string }>;
}

export async function generateMetadata({
  params,
}: SallePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const salle = await fetchSalleServer(Number(id));
    return {
      title: `${salle.nom} — Mairie de Lomé`,
      description: `Fiche de la salle ${salle.nom} : capacité, équipement et réservation.`,
    };
  } catch {
    return { title: "Salle introuvable — Mairie de Lomé" };
  }
}

export default async function SalleDetailPage({
  params,
  searchParams,
}: SallePageProps) {
  const { id } = await params;
  const { debut, fin } = await searchParams;
  const salleId = Number(id);

  if (Number.isNaN(salleId)) {
    notFound();
  }

  let salle;
  try {
    salle = await fetchSalleServer(salleId);
  } catch {
    notFound();
  }

  const slotRange = parseQueryDateRange(debut, fin);
  let estLibreSurCreneau: boolean | null = null;

  if (slotRange) {
    try {
      const disponibilite = await fetchSalleDisponibiliteServer(salleId, slotRange);
      estLibreSurCreneau = disponibilite.est_libre;
    } catch {
      estLibreSurCreneau = null;
    }
  }

  return (
    <div className="flex min-h-full flex-col overflow-x-clip bg-background">
      <PortalHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <SalleDetailContent
          salle={salle}
          slotRange={slotRange}
          estLibreSurCreneau={estLibreSurCreneau}
        />
      </main>

      <PortalFooter />
    </div>
  );
}
