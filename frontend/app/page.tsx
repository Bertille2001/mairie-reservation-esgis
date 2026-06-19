import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Info,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const accessCards = [
  {
    title: "Portail public",
    description:
      "Consultez le planning des salles et déposez une demande de réservation.",
    icon: CalendarDays,
    href: "/planning",
    cta: "Voir le planning",
    badge: "Sans connexion",
    primary: true,
  },
  {
    title: "Espace employé",
    description:
      "Traitez les demandes, gérez les réservations, les clés et les paiements.",
    icon: ShieldCheck,
    href: "/employe",
    cta: "Se connecter",
    badge: "Personnel municipal",
    primary: false,
  },
  {
    title: "Espace gardien",
    description:
      "Consultez le planning de votre salle et enregistrez les remises de clés.",
    icon: KeyRound,
    href: "/gardien",
    cta: "Se connecter",
    badge: "Gardien de salle",
    primary: false,
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <Building2 className="size-5" strokeWidth={1.75} aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                Mairie de Lomé
              </p>
              <p className="text-muted-foreground text-xs">
                Gestion des salles municipales
              </p>
            </div>
          </div>
          <Badge variant="secondary">Service public</Badge>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10 md:py-14">
        <Alert variant="info">
          <Info aria-hidden />
          <AlertTitle>Portail ouvert au public</AlertTitle>
          <AlertDescription>
            Le planning affiche uniquement les créneaux libres ou occupés — aucun
            nom de demandeur ni motif de manifestation n&apos;est visible.
          </AlertDescription>
        </Alert>

        <section className="max-w-2xl space-y-5">
          <Badge variant="default">Réservation en ligne</Badge>
          <h1 className="font-semibold text-[2rem] text-foreground leading-tight tracking-[-0.02em] text-balance">
            Réservez une salle municipale en quelques clics
          </h1>
          <p className="max-w-xl text-[0.9375rem] text-muted-foreground leading-relaxed">
            Consultez la disponibilité des salles, déposez votre demande et
            suivez son traitement depuis le hall de la mairie ou votre
            navigateur.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="/planning" />} size="lg">
              Consulter le planning
              <ArrowRight aria-hidden />
            </Button>
            <Button
              render={<Link href="/planning/demande" />}
              variant="outline"
              size="lg"
            >
              Déposer une demande
            </Button>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-semibold text-lg text-foreground tracking-[-0.01em]">
              Accès aux espaces
            </h2>
            <p className="mt-1 text-muted-foreground text-sm">
              Choisissez l&apos;espace correspondant à votre profil.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {accessCards.map((item) => (
              <Card key={item.title} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                  <CardAction>
                    <Badge variant="outline">{item.badge}</Badge>
                  </CardAction>
                </CardHeader>
                <CardPanel>
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                    <item.icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </div>
                </CardPanel>
                <CardFooter className="mt-auto justify-end">
                  <Button
                    render={<Link href={item.href} />}
                    variant={item.primary ? "default" : "outline"}
                    className="w-full sm:w-auto"
                  >
                    {item.cta}
                    <ArrowRight aria-hidden />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Légende du planning</CardTitle>
            <CardDescription>
              Codes couleur affichés sur le portail public.
            </CardDescription>
          </CardHeader>
          <CardPanel className="flex flex-wrap gap-3">
            <Badge
              variant="success"
              className="h-auto gap-2 px-3 py-1.5 text-sm"
            >
              <span className="size-2 rounded-full bg-success" aria-hidden />
              Libre
            </Badge>
            <Badge
              variant="outline"
              className="h-auto gap-2 border-planning-occupe-fg/20 bg-planning-occupe px-3 py-1.5 text-planning-occupe-fg text-sm"
            >
              <span
                className="size-2 rounded-full bg-planning-occupe-fg"
                aria-hidden
              />
              Occupé
            </Badge>
          </CardPanel>
        </Card>
      </main>

      <footer className="mt-auto border-t border-border bg-card/30">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-5 text-muted-foreground text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>Mairie de Lomé — Réservation des salles municipales</p>
          <p className="font-mono text-xs">DK Technologies · 2026</p>
        </div>
        <Separator />
      </footer>
    </div>
  );
}
