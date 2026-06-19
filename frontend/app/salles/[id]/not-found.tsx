import Link from "next/link";

import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";
import { Button } from "@/components/ui/button";

export default function SalleNotFound() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <PortalHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center gap-4 px-6 py-16">
        <h1 className="font-semibold text-xl text-foreground">Salle introuvable</h1>
        <p className="max-w-md text-muted-foreground text-sm">
          Cette salle n&apos;existe pas ou n&apos;est plus disponible à la
          réservation.
        </p>
        <Button render={<Link href="/salles" />} className="min-h-11 rounded-lg">
          Voir toutes les salles
        </Button>
      </main>
      <PortalFooter />
    </div>
  );
}
