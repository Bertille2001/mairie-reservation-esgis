import { Suspense } from "react";

import { DemandeConfirmation } from "@/components/demande/demande-confirmation";
import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Demande enregistrée — Mairie de Lomé",
  description: "Confirmation de votre demande de réservation de salle municipale.",
};

function ConfirmationFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export default function DemandeConfirmationPage() {
  return (
    <div className="flex min-h-full flex-col overflow-x-clip bg-background">
      <PortalHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <section className="space-y-3">
          <p className="text-muted-foreground text-sm">Confirmation</p>
          <h1 className="font-semibold text-[1.75rem] text-foreground leading-tight tracking-[-0.03em] md:text-[2rem]">
            Votre demande a été envoyée
          </h1>
        </section>

        <Suspense fallback={<ConfirmationFallback />}>
          <DemandeConfirmation />
        </Suspense>
      </main>

      <PortalFooter />
    </div>
  );
}
