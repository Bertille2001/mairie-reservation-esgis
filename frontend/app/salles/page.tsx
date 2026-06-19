import Link from "next/link";

import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";
import { SallesListPanel } from "@/components/salles/salles-list-panel";
import { fetchSallesServer } from "@/lib/api";
import type { SalleDetail } from "@/lib/types";

export const metadata = {
  title: "Salles municipales — Mairie de Lomé",
  description:
    "Liste des salles municipales disponibles à la réservation à Lomé.",
};

export default async function SallesPage() {
  let salles: SalleDetail[] = [];
  let error: string | null = null;

  try {
    salles = await fetchSallesServer();
  } catch {
    error = "Impossible de charger la liste des salles.";
  }

  return (
    <div className="flex min-h-full flex-col overflow-x-clip bg-background">
      <PortalHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <section className="max-w-3xl space-y-3">
          <h1 className="font-semibold text-[1.75rem] text-foreground leading-tight tracking-[-0.03em] text-balance md:text-[2.125rem]">
            Salles municipales
          </h1>
          <p className="max-w-2xl text-[0.9375rem] text-muted-foreground leading-relaxed">
            Consultez les salles disponibles, leurs capacités et leur équipement
            avant de déposer une demande de réservation.
          </p>
        </section>

        {error ? (
          <div className="rounded-xl border border-border/60 bg-surface-elevated px-6 py-10 text-center shadow-panel">
            <p className="font-medium text-foreground text-sm">{error}</p>
            <Link
              href="/"
              className="mt-4 inline-flex min-h-11 items-center text-primary text-sm underline-offset-4 hover:underline focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              Retour au planning
            </Link>
          </div>
        ) : (
          <SallesListPanel salles={salles} />
        )}
      </main>

      <PortalFooter />
    </div>
  );
}
