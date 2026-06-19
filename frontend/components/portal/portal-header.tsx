import Link from "next/link";
import { Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PortalHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-surface-elevated/80 pt-[env(safe-area-inset-top,0px)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="flex min-h-11 min-w-0 items-center gap-2.5 rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary/30 sm:gap-3"
          aria-label="Mairie de Lomé — Accueil"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-sm text-foreground">
              Mairie de Lomé
            </p>
            <p className="hidden truncate text-muted-foreground text-xs sm:block">
              Réservation des salles municipales
            </p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Service public
          </Badge>
          <Button
            render={<Link href="/salles" />}
            variant="ghost"
            size="sm"
            className="min-h-11 rounded-lg px-2.5 sm:px-3"
          >
            Salles
          </Button>
          <Button
            render={<Link href="/connexion" />}
            variant="ghost"
            size="sm"
            className="min-h-11 rounded-lg px-2.5 sm:px-3"
          >
            <span className="sm:hidden">Connexion</span>
            <span className="hidden sm:inline">Espace personnel</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
