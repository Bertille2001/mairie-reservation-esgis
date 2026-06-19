"use client";

import Link from "next/link";

import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";
import { Button } from "@/components/ui/button";

export default function DemandeError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col overflow-x-clip bg-background">
      <PortalHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center sm:px-6">
        <h1 className="font-semibold text-foreground text-lg">
          Impossible de charger la demande
        </h1>
        <p className="max-w-md text-muted-foreground text-sm">
          Une erreur est survenue lors du chargement du formulaire. Vérifiez
          votre connexion ou réessayez.
        </p>
        <div className="flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Button type="button" onClick={reset} className="min-h-11 w-full rounded-lg sm:w-auto">
            Réessayer
          </Button>
          <Button
            render={<Link href="/" />}
            variant="outline"
            className="min-h-11 w-full rounded-lg sm:w-auto"
          >
            Retour au planning
          </Button>
        </div>
      </main>
      <PortalFooter />
    </div>
  );
}
