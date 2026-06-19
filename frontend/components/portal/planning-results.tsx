"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CalendarX2, Search } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRangeLabel } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { DateRange, SallePlanning } from "@/lib/types";

import { RoomListRow } from "./room-list-row";

type FilterTab = "all" | "libre" | "occupe";

interface PlanningResultsProps {
  salles: SallePlanning[];
  range: DateRange;
  loading: boolean;
  error: string | null;
}

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "libre", label: "Libres" },
  { id: "occupe", label: "Occupées" },
];

function PlanningSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-surface-elevated shadow-panel">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="size-4 rounded-sm" />
          </div>
          {i < 7 && <div className="mx-4 border-b border-border/50" />}
        </div>
      ))}
    </div>
  );
}

function SegmentedControl({
  value,
  onChange,
  counts,
}: {
  value: FilterTab;
  onChange: (tab: FilterTab) => void;
  counts: Record<FilterTab, number>;
}) {
  return (
    <div
      className="flex rounded-lg bg-muted p-1"
      role="tablist"
      aria-label="Filtrer les salles"
    >
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={value === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "min-h-11 flex-1 rounded-md px-2 py-2 text-xs font-medium transition-all sm:px-3 sm:text-sm",
            value === tab.id
              ? "bg-surface-elevated text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
          <span className="ml-1 text-xs opacity-70">({counts[tab.id]})</span>
        </button>
      ))}
    </div>
  );
}

export function PlanningResults({
  salles,
  range,
  loading,
  error,
}: PlanningResultsProps) {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(
    () => ({
      all: salles.length,
      libre: salles.filter((s) => s.est_libre).length,
      occupe: salles.filter((s) => !s.est_libre).length,
    }),
    [salles],
  );

  const filtered = useMemo(() => {
    let list = [...salles];
    if (filter === "libre") list = list.filter((s) => s.est_libre);
    if (filter === "occupe") list = list.filter((s) => !s.est_libre);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) => s.nom.toLowerCase().includes(q));
    }
    return list.sort((a, b) => Number(b.est_libre) - Number(a.est_libre));
  }, [salles, filter, search]);

  const libres = counts.libre;

  return (
    <div className="flex flex-col gap-5" aria-live="polite">
      <div className="space-y-1">
        <h2 className="font-semibold text-lg text-foreground tracking-[-0.02em]">
          Disponibilité des salles
        </h2>
        <p className="break-words text-muted-foreground text-sm">
          {formatRangeLabel(range)}
          {!loading && !error && salles.length > 0 && (
            <span className="text-foreground">
              {" "}
              · {libres} libre{libres > 1 ? "s" : ""} sur {salles.length}
            </span>
          )}
        </p>
      </div>

      {!loading && !error && salles.length > 0 && (
        <div className="flex flex-col gap-3">
          <SegmentedControl
            value={filter}
            onChange={setFilter}
            counts={counts}
          />
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une salle…"
              className="min-h-11 w-full rounded-lg bg-muted/80 py-2.5 pr-4 pl-11 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30"
              aria-label="Rechercher une salle"
            />
          </div>
        </div>
      )}

      {loading && <PlanningSkeleton />}

      {!loading && error && (
        <Alert variant="error" className="rounded-xl">
          <AlertCircle aria-hidden />
          <AlertTitle>Impossible de charger le planning</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && salles.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-surface-elevated px-6 py-14 text-center shadow-panel">
          <CalendarX2
            className="size-8 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="font-medium text-foreground text-sm">
            Aucune salle trouvée
          </p>
          <p className="max-w-sm text-muted-foreground text-sm">
            Modifiez la plage de dates ou réessayez plus tard.
          </p>
        </div>
      )}

      {!loading && !error && salles.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-surface-elevated px-6 py-14 text-center shadow-panel">
          <Search
            className="size-8 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="font-medium text-foreground text-sm">
            Aucun résultat
          </p>
          <p className="max-w-sm text-muted-foreground text-sm">
            Essayez un autre filtre ou terme de recherche.
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="max-h-[min(70vh,640px)] overflow-hidden overflow-y-auto rounded-xl border border-border/60 bg-surface-elevated shadow-panel">
          {filtered.map((salle, index) => (
            <RoomListRow
              key={salle.id}
              salle={salle}
              range={range}
              isLast={index === filtered.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
