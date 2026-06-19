import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildDemandeUrl, buildSalleUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { DateRange, SallePlanning } from "@/lib/types";

interface RoomListRowProps {
  salle: SallePlanning;
  range: DateRange;
  isLast?: boolean;
}

function StatusIndicator({ libre }: { libre: boolean }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center gap-1.5 text-xs font-medium",
        libre ? "text-success-fg" : "text-planning-occupe-fg",
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          libre ? "bg-success" : "bg-planning-occupe-fg",
        )}
        aria-hidden
      />
      {libre ? "Libre" : "Occupé"}
    </span>
  );
}

export function RoomListRow({ salle, range, isLast }: RoomListRowProps) {
  const libre = salle.est_libre;
  const salleUrl = buildSalleUrl(salle.id, range);
  const demandeUrl = buildDemandeUrl(salle.id, range);

  return (
    <>
      <div
        className={cn(
          "flex min-h-[52px] flex-wrap items-center gap-x-2 gap-y-2 px-4 py-3.5 sm:flex-nowrap sm:gap-3",
          libre
            ? "border-l-2 border-l-success/50 bg-success/4"
            : "border-l-2 border-l-planning-occupe/50 bg-planning-occupe/30",
        )}
      >
        <Link
          href={salleUrl}
          className="min-w-0 flex-1 truncate font-medium text-[0.9375rem] text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          {salle.nom}
        </Link>
        <StatusIndicator libre={libre} />
        {libre ? (
          <Button
            render={<Link href={demandeUrl} />}
            size="sm"
            className="min-h-9 shrink-0 rounded-lg"
          >
            Réserver
          </Button>
        ) : (
          <Link
            href={salleUrl}
            className="flex min-h-9 min-w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:bg-accent/40 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            aria-label={`Voir la fiche de ${salle.nom}`}
          >
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>
      {!isLast && <div className="mx-4 border-b border-border/50" aria-hidden />}
    </>
  );
}
