"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { DemandeDetail } from "@/components/employe/demande-detail";
import { TraiterActions } from "@/components/employe/traiter-actions";
import { EmployePageSkeleton } from "@/components/employe/employe-page-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AuthError, fetchReservationById } from "@/lib/api-auth";
import { clearTokens } from "@/lib/auth";
import type { DemandeReservation } from "@/lib/types";

interface DemandeDetailPanelProps {
  id: number;
}

export function DemandeDetailPanel({ id }: DemandeDetailPanelProps) {
  const [demande, setDemande] = useState<DemandeReservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    fetchReservationById(id)
      .then((data) => {
        if (!data) {
          setNotFoundState(true);
        } else {
          setDemande(data);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof AuthError) {
          clearTokens();
          window.location.replace("/connexion");
          return;
        }
        setError("Impossible de charger cette demande.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <EmployePageSkeleton />;
  }

  if (notFoundState) {
    notFound();
  }

  if (error || !demande) {
    return (
      <Alert variant="error" className="rounded-xl">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error ?? "Demande introuvable."}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-3xl space-y-3">
        <Button
          render={<Link href="/employe" />}
          variant="ghost"
          className="min-h-11 -ml-2 rounded-lg"
        >
          <ArrowLeft aria-hidden />
          Retour à la file des demandes
        </Button>
        <h1 className="font-semibold text-[1.75rem] text-foreground leading-tight tracking-[-0.03em]">
          Détail de la demande
        </h1>
      </div>

      <div className="flex max-w-3xl flex-col gap-5">
        <DemandeDetail demande={demande} />
        <TraiterActions demande={demande} onTraite={setDemande} />
      </div>
    </div>
  );
}
