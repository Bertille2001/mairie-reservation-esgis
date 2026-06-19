import { notFound } from "next/navigation";

import { SuiviPanel } from "@/components/employe/suivi-panel";

export const metadata = {
  title: "Suivi des clés — Espace gardien",
};

export default async function GardienReservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservationId = Number.parseInt(id, 10);

  if (Number.isNaN(reservationId)) {
    notFound();
  }

  return <SuiviPanel id={reservationId} variant="gardien" />;
}
