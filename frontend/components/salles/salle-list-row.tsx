import Link from "next/link";
import { ChevronRight, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCapacite } from "@/lib/format";
import type { SalleDetail } from "@/lib/types";

interface SalleListRowProps {
  salle: SalleDetail;
  isLast?: boolean;
}

export function SalleListRow({ salle, isLast }: SalleListRowProps) {
  return (
    <>
      <Link
        href={`/salles/${salle.id}`}
        className="group flex min-h-[56px] items-center gap-2 px-4 py-3.5 transition-colors hover:bg-accent/40 active:bg-accent/60 focus-visible:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 sm:gap-3"
      >
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate font-medium text-[0.9375rem] text-foreground">
            {salle.nom}
          </p>
          <p className="flex items-center gap-1.5 truncate text-muted-foreground text-xs">
            <MapPin className="size-3 shrink-0" aria-hidden />
            {salle.adresse}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground text-xs sm:hidden">
            <span className="flex items-center gap-1">
              <Users className="size-3 shrink-0" aria-hidden />
              {formatCapacite(salle.capacite_min, salle.capacite_max)}
            </span>
            <Badge variant={salle.est_payante ? "outline" : "secondary"} className="text-xs">
              {salle.est_payante ? "Payante" : "Gratuite"}
            </Badge>
          </p>
        </div>
        <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
          <span className="flex items-center gap-1 text-muted-foreground text-xs">
            <Users className="size-3" aria-hidden />
            {formatCapacite(salle.capacite_min, salle.capacite_max)}
          </span>
          <Badge variant={salle.est_payante ? "outline" : "secondary"} className="text-xs">
            {salle.est_payante ? "Payante" : "Gratuite"}
          </Badge>
        </div>
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
          aria-hidden
        />
      </Link>
      {!isLast && <div className="mx-4 border-b border-border/50" aria-hidden />}
    </>
  );
}
