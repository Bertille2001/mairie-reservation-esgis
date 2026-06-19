import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function DemandeNotFound() {
  return (
    <div className="flex flex-col items-start justify-center gap-4 py-8">
      <h1 className="font-semibold text-xl text-foreground">Demande introuvable</h1>
      <p className="max-w-md text-muted-foreground text-sm">
        Cette demande n&apos;existe pas ou n&apos;est plus accessible.
      </p>
      <Button render={<Link href="/employe" />} className="min-h-11 rounded-lg">
        Retour à la file des demandes
      </Button>
    </div>
  );
}
