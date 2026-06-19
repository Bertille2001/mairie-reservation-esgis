"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function GardienReservationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <EmptyState
        icon={AlertCircle}
        title="Impossible d'afficher le suivi"
        description={
          error.message ||
          "Une erreur est survenue lors du chargement de cette réservation."
        }
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              className="min-h-11 rounded-lg"
              onClick={reset}
            >
              Réessayer
            </Button>
            <Button
              render={<Link href="/gardien" />}
              variant="outline"
              className="min-h-11 rounded-lg"
            >
              Retour à la liste
            </Button>
          </div>
        }
      />
    </div>
  );
}
