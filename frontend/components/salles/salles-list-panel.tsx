"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { SalleListRow } from "@/components/salles/salle-list-row";
import { Button } from "@/components/ui/button";
import type { SalleDetail } from "@/lib/types";

interface SallesListPanelProps {
  salles: SalleDetail[];
}

export function SallesListPanel({ salles }: SallesListPanelProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return salles;
    const q = search.trim().toLowerCase();
    return salles.filter(
      (s) =>
        s.nom.toLowerCase().includes(q) ||
        s.adresse.toLowerCase().includes(q),
    );
  }, [salles, search]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.nom.localeCompare(b.nom, "fr")),
    [filtered],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou adresse…"
          className="min-h-11 w-full rounded-lg bg-muted/80 py-2.5 pr-4 pl-11 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30"
          aria-label="Rechercher une salle"
        />
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-surface-elevated px-6 py-14 text-center shadow-panel">
          <p className="font-medium text-foreground text-sm">Aucun résultat</p>
          <p className="mt-1 text-muted-foreground text-sm">
            Essayez un autre terme de recherche.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-surface-elevated shadow-panel">
          {sorted.map((salle, index) => (
            <SalleListRow
              key={salle.id}
              salle={salle}
              isLast={index === sorted.length - 1}
            />
          ))}
        </div>
      )}

      <div className="flex justify-start">
        <Button
          render={<Link href="/" />}
          variant="ghost"
          className="min-h-11 rounded-lg"
        >
          <ArrowLeft aria-hidden />
          Retour au planning
        </Button>
      </div>
    </div>
  );
}
