import { GardienReservationList } from "@/components/gardien/reservation-list";

export const metadata = {
  title: "Suivi des clés — Espace gardien",
  description: "Remise et restitution des clés pour les réservations de votre salle.",
};

export default function GardienPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="max-w-3xl font-semibold text-[1.75rem] text-foreground leading-tight tracking-[-0.03em] md:text-[2.125rem]">
        Suivi des clés
      </h1>

      <GardienReservationList />
    </div>
  );
}
