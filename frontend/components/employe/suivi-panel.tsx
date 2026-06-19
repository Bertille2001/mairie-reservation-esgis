"use client";

import { useEffect, useState } from "react";

import {
  KeyTrackingSuiviForm,
  type KeyTrackingSuiviVariant,
} from "@/components/suivi/key-tracking-suivi-form";
import { EmployePageSkeleton } from "@/components/employe/employe-page-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AuthError, fetchReservationById, fetchSuivi } from "@/lib/api-auth";
import { clearTokens } from "@/lib/auth";
import type { DemandeReservation, SuiviCles } from "@/lib/types";

interface SuiviPanelProps {
  id: number;
  variant?: KeyTrackingSuiviVariant;
}

export function SuiviPanel({ id, variant = "employe" }: SuiviPanelProps) {
  const [demande, setDemande] = useState<DemandeReservation | null>(null);
  const [suivi, setSuivi] = useState<SuiviCles | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const reservation = await fetchReservationById(id);
        if (!reservation) {
          setError("Réservation introuvable.");
          setLoading(false);
          return;
        }
        if (reservation.statut !== "acceptee") {
          setError("Le suivi n'est disponible que pour les demandes acceptées.");
          setLoading(false);
          return;
        }
        const suiviData = await fetchSuivi(id);
        setDemande(reservation);
        setSuivi(suiviData);
        setLoading(false);
      } catch (err) {
        if (err instanceof AuthError) {
          clearTokens();
          window.location.replace("/connexion");
          return;
        }
        setError("Impossible de charger le suivi de cette réservation.");
        setLoading(false);
      }
    }

    void load();
  }, [id]);

  if (loading) {
    return <EmployePageSkeleton />;
  }

  if (error || !demande || !suivi) {
    return (
      <div className="max-w-3xl space-y-4">
        <h1 className="font-semibold text-[1.75rem] text-foreground leading-tight tracking-[-0.03em]">
          Suivi des clés
        </h1>
        <Alert variant="error" className="rounded-xl">
          <AlertTitle>Accès impossible</AlertTitle>
          <AlertDescription>
            {error ?? "Données de suivi indisponibles."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="max-w-3xl font-semibold text-[1.75rem] text-foreground leading-tight tracking-[-0.03em]">
        Suivi des clés
      </h1>

      <div className="max-w-3xl">
        <KeyTrackingSuiviForm
          demande={demande}
          suivi={suivi}
          onUpdate={setSuivi}
          variant={variant}
        />
      </div>
    </div>
  );
}
