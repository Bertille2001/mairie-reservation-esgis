"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function GardienError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
      <EmptyState
        icon={AlertCircle}
        title="Impossible de charger l'espace gardien"
        description={
          error.message ||
          "Une erreur est survenue. Réessayez ou reconnectez-vous."
        }
        action={
          <Button
            type="button"
            className="min-h-11 rounded-lg"
            onClick={reset}
          >
            Réessayer
          </Button>
        }
      />
    </div>
  );
}
