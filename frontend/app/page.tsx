import { Suspense } from "react";

import { PlanningBoardLoader } from "@/components/portal/planning-board-loader";
import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";
import { PortalPageSkeleton } from "@/components/portal/portal-page-skeleton";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col overflow-x-clip bg-background">
      <PortalHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10 lg:py-12">
        <section className="max-w-3xl space-y-3">
          <h1 className="font-semibold text-[1.75rem] text-foreground leading-tight tracking-[-0.03em] text-balance md:text-[2.125rem]">
            Consultez la disponibilité des salles municipales
          </h1>
          <p className="max-w-2xl text-[0.9375rem] text-muted-foreground leading-relaxed">
            Sélectionnez une période pour voir quelles salles sont libres ou
            occupées, puis déposez votre demande de réservation.
          </p>
        </section>

        <Suspense fallback={<PortalPageSkeleton />}>
          <PlanningBoardLoader />
        </Suspense>
      </main>

      <PortalFooter />
    </div>
  );
}
