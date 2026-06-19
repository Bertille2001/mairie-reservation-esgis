import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { buildSalleUrl } from "@/lib/api";
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
        "flex shrink-0 items-center gap-1.5 text-xs font-medium max-sm:sr-only",
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
  const href = buildSalleUrl(salle.id, range);
  const actionLabel = "Voir la fiche salle";

  return (
    <>
      <Link
        href={href}
        className="group flex min-h-[52px] items-center gap-2 px-4 py-3.5 transition-colors hover:bg-accent/40 active:bg-accent/60 focus-visible:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 sm:gap-3"
        aria-label={`${salle.nom} — ${libre ? "Libre" : "Occupé"} — ${actionLabel}`}
      >
        <span className="min-w-0 flex-1 truncate font-medium text-[0.9375rem] text-foreground">
          {salle.nom}
        </span>
        <StatusIndicator libre={libre} />
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
          aria-hidden
        />
      </Link>
      {!isLast && <div className="mx-4 border-b border-border/50" aria-hidden />}
    </>
  );
}
