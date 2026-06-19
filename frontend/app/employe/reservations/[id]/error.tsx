"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function ReservationSuiviError({
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
    <div className="flex flex-col gap-6">
      <Alert variant="error" className="rounded-xl">
        <AlertCircle aria-hidden />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          {error.message || "Impossible d'afficher le suivi de réservation."}
        </AlertDescription>
      </Alert>
      <Button type="button" onClick={reset} className="min-h-11 w-fit rounded-lg">
        Réessayer
      </Button>
    </div>
  );
}
