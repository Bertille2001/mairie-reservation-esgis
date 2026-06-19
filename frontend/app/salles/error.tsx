"use client";

import Link from "next/link";

import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";
import { Button } from "@/components/ui/button";

export default function SallesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <PortalHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start gap-4 px-6 py-16">
        <h1 className="font-semibold text-xl text-foreground">
          Erreur de chargement
        </h1>
        <p className="max-w-md text-muted-foreground text-sm">
          Impossible d&apos;afficher les salles pour le moment.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={reset} className="min-h-11 rounded-lg">
            Réessayer
          </Button>
          <Button
            render={<Link href="/" />}
            variant="outline"
            className="min-h-11 rounded-lg"
          >
            Retour au planning
          </Button>
        </div>
      </main>
      <PortalFooter />
    </div>
  );
}
