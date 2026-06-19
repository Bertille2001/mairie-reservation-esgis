"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Error({
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
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-16">
      <Alert variant="error" className="rounded-xl">
        <AlertCircle aria-hidden />
        <AlertTitle>Une erreur est survenue</AlertTitle>
        <AlertDescription>
          {error.message || "Impossible d'afficher cette page."}
        </AlertDescription>
      </Alert>
      <div>
        <Button type="button" onClick={reset} className="min-h-11 rounded-lg">
          Réessayer
        </Button>
      </div>
    </div>
  );
}
