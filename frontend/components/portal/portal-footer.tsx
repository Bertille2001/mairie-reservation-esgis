import { Separator } from "@/components/ui/separator";

export function PortalFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card/30 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-muted-foreground text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Mairie de Lomé — Réservation des salles municipales</p>
        <p className="font-mono text-xs">DK Technologies · 2026</p>
      </div>
      <Separator />
    </footer>
  );
}
