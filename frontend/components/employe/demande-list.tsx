"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Inbox } from "lucide-react";

import { DemandeListRow } from "@/components/employe/demande-list-row";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthError, fetchReservations } from "@/lib/api-auth";
import { clearTokens } from "@/lib/auth";
import { formInputClassName } from "@/components/demande/form-field";
import type { DemandeReservation, StatutDemande } from "@/lib/types";

const STATUT_OPTIONS: { value: StatutDemande | ""; label: string }[] = [
  { value: "en_attente", label: "En attente" },
  { value: "acceptee", label: "Acceptées" },
  { value: "refusee", label: "Refusées" },
  { value: "", label: "Toutes" },
];

interface DemandeListProps {
  initialStatut?: StatutDemande;
}

export function DemandeList({ initialStatut = "en_attente" }: DemandeListProps) {
  const [statut, setStatut] = useState<StatutDemande | "">(initialStatut);
  const [salleFilter, setSalleFilter] = useState("");
  const [demandes, setDemandes] = useState<DemandeReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchReservations(statut || undefined)
      .then((data) => {
        if (!cancelled) {
          setDemandes(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof AuthError) {
          clearTokens();
          window.location.replace("/connexion");
          return;
        }
        setError("Impossible de charger les demandes.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [statut]);

  function handleStatutChange(value: StatutDemande | "") {
    setLoading(true);
    setStatut(value);
  }

  function handleSalleChange(value: string) {
    setSalleFilter(value);
  }

  const salles = useMemo(() => {
    const names = new Set(demandes.map((d) => d.salle_nom));
    return [...names].sort((a, b) => a.localeCompare(b, "fr"));
  }, [demandes]);

  const filtered = useMemo(() => {
    let list = [...demandes];
    if (salleFilter) {
      list = list.filter((d) => d.salle_nom === salleFilter);
    }
    return list.sort(
      (a, b) =>
        new Date(b.date_soumission).getTime() -
        new Date(a.date_soumission).getTime(),
    );
  }, [demandes, salleFilter]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-h-11 flex-1 items-center gap-2">
          <Filter className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <select
            value={statut}
            onChange={(event) =>
              handleStatutChange(event.target.value as StatutDemande | "")
            }
            className={formInputClassName}
            aria-label="Filtrer par statut"
          >
            {STATUT_OPTIONS.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <select
          value={salleFilter}
          onChange={(event) => handleSalleChange(event.target.value)}
          className={`${formInputClassName} sm:max-w-xs`}
          aria-label="Filtrer par salle"
        >
          <option value="">Toutes les salles</option>
          {salles.map((nom) => (
            <option key={nom} value={nom}>
              {nom}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <Alert variant="error" className="rounded-xl">
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-surface-elevated shadow-panel">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border-b border-border/50 px-4 py-4 last:border-b-0"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Aucune demande"
          description={
            statut === "en_attente"
              ? "Aucune demande en attente de traitement pour le moment."
              : "Aucun résultat pour ces filtres."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-surface-elevated shadow-panel">
          {filtered.map((demande, index) => (
            <DemandeListRow
              key={demande.id}
              demande={demande}
              isLast={index === filtered.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
