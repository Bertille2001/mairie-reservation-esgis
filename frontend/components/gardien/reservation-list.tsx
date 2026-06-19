"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, KeyRound } from "lucide-react";

import { ReservationListRow } from "@/components/gardien/reservation-list-row";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthError, fetchReservations, fetchSuivi } from "@/lib/api-auth";
import { clearTokens } from "@/lib/auth";
import {
  getKeyTrackingStatus,
  needsGardienAttention,
} from "@/lib/suivi-status";
import { cn } from "@/lib/utils";
import type { DemandeReservation, SuiviCles } from "@/lib/types";

type FilterTab = "action" | "today" | "all";

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "action", label: "À traiter" },
  { id: "today", label: "Aujourd'hui" },
  { id: "all", label: "Toutes" },
];

interface ReservationWithSuivi {
  demande: DemandeReservation;
  suivi: SuiviCles | null;
}

function isToday(dateIso: string, now: Date): boolean {
  const date = new Date(dateIso);
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function ReservationSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-surface-elevated shadow-panel">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border-b border-border/50 px-4 py-4 last:border-b-0"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  );
}

export function GardienReservationList() {
  const [filter, setFilter] = useState<FilterTab>("action");
  const [items, setItems] = useState<ReservationWithSuivi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const reservations = await fetchReservations("acceptee");
        const suivis = await Promise.all(
          reservations.map(async (demande) => {
            try {
              const suivi = await fetchSuivi(demande.id);
              return { demande, suivi };
            } catch {
              return { demande, suivi: null };
            }
          }),
        );

        if (!cancelled) {
          setItems(suivis);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof AuthError) {
          clearTokens();
          window.location.replace("/connexion");
          return;
        }
        setError("Impossible de charger les réservations de votre salle.");
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    let action = 0;
    let overdue = 0;

    for (const item of items) {
      if (!item.suivi) continue;
      const status = getKeyTrackingStatus(item.suivi, now);
      if (needsGardienAttention(item.suivi, now)) action += 1;
      if (status === "overdue_handover" || status === "overdue_return") {
        overdue += 1;
      }
    }

    return { action, overdue };
  }, [items]);

  const filtered = useMemo(() => {
    const now = new Date();
    let list = items.filter((item) => item.suivi);

    if (filter === "action") {
      list = list.filter((item) =>
        item.suivi ? needsGardienAttention(item.suivi, now) : false,
      );
    } else if (filter === "today") {
      list = list.filter(
        (item) =>
          isToday(item.demande.date_debut, now) ||
          isToday(item.demande.date_fin, now) ||
          (new Date(item.demande.date_debut) <= now &&
            new Date(item.demande.date_fin) >= now),
      );
    }

    return list.sort((a, b) => {
      const statusA = a.suivi ? getKeyTrackingStatus(a.suivi, now) : "returned";
      const statusB = b.suivi ? getKeyTrackingStatus(b.suivi, now) : "returned";
      const priority = (s: string) =>
        s === "overdue_return" || s === "overdue_handover"
          ? 0
          : s === "pending_handover"
            ? 1
            : s === "in_use"
              ? 2
              : 3;
      const diff = priority(statusA) - priority(statusB);
      if (diff !== 0) return diff;
      return (
        new Date(a.demande.date_debut).getTime() -
        new Date(b.demande.date_debut).getTime()
      );
    });
  }, [items, filter]);

  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex rounded-lg bg-muted p-1"
        role="tablist"
        aria-label="Filtrer les réservations"
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={filter === tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              "min-h-11 flex-1 rounded-md px-2 py-2 text-xs font-medium transition-all sm:px-3 sm:text-sm",
              filter === tab.id
                ? "bg-surface-elevated text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {tab.id === "action" && stats.action > 0 && (
              <span className="ml-1 opacity-80">({stats.action})</span>
            )}
          </button>
        ))}
      </div>

      {stats.overdue > 0 && (
        <Alert variant="warning" className="rounded-xl">
          <AlertTriangle aria-hidden />
          <AlertTitle>
            {stats.overdue} dossier{stats.overdue > 1 ? "s" : ""} en retard
          </AlertTitle>
        </Alert>
      )}

      {error && (
        <Alert variant="error" className="rounded-xl">
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <ReservationSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={filter === "today" ? CalendarDays : KeyRound}
          title={
            filter === "action"
              ? "Aucune action en attente"
              : filter === "today"
                ? "Aucune réservation aujourd'hui"
                : "Aucune réservation"
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-surface-elevated shadow-panel">
          {filtered.map((item, index) => (
            <ReservationListRow
              key={item.demande.id}
              demande={item.demande}
              suivi={item.suivi}
              isLast={index === filtered.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
