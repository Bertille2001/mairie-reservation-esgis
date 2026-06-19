"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function ConnexionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-full flex-col bg-background">
      <PortalHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-16 sm:px-6">
        <Alert variant="error" className="max-w-lg rounded-xl">
          <AlertCircle aria-hidden />
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>
            {error.message || "Impossible d'afficher la page de connexion."}
          </AlertDescription>
        </Alert>
        <Button type="button" onClick={reset} className="min-h-11 w-fit rounded-lg">
          Réessayer
        </Button>
      </main>
      <PortalFooter />
    </div>
  );
}
