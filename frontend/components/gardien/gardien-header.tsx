"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { clearTokens } from "@/lib/auth";
import type { User } from "@/lib/types";

interface GardienHeaderProps {
  user: User;
  salleNom?: string | null;
}

export function GardienHeader({ user, salleNom }: GardienHeaderProps) {
  const router = useRouter();

  function handleLogout() {
    clearTokens();
    router.replace("/connexion");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-surface-elevated/80 pt-[env(safe-area-inset-top,0px)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link
          href="/gardien"
          className="flex min-h-11 min-w-0 items-center gap-2.5 rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary/30 sm:gap-3"
          aria-label="Espace gardien — Accueil"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-sm text-foreground">
              Espace gardien
            </p>
            <p className="hidden truncate text-muted-foreground text-xs sm:block">
              {salleNom ?? "Mairie de Lomé — Réservations"}
            </p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <p className="hidden text-muted-foreground text-xs sm:block">
            {user.prenom} {user.nom}
          </p>
          <Button
            render={<Link href="/" />}
            variant="ghost"
            size="sm"
            className="min-h-11 rounded-lg px-2.5 sm:px-3"
          >
            Portail public
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-11 rounded-lg px-2.5 sm:px-3"
            onClick={handleLogout}
          >
            <LogOut className="sm:mr-1" aria-hidden />
            <span className="hidden sm:inline">Déconnexion</span>
            <span className="sm:hidden">Quitter</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
