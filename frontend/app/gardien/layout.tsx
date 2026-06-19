import { GardienShell } from "@/components/gardien/gardien-shell";

export const metadata = {
  title: "Espace gardien — Mairie de Lomé",
  description:
    "Planning mono-salle et suivi de la remise et restitution des clés.",
};

export default function GardienLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GardienShell>{children}</GardienShell>;
}
