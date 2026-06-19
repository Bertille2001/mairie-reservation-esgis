import { notFound } from "next/navigation";

import { SuiviPanel } from "@/components/employe/suivi-panel";

export const metadata = {
  title: "Suivi des clés — Espace employé",
};

export default async function ReservationSuiviPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservationId = Number.parseInt(id, 10);

  if (Number.isNaN(reservationId)) {
    notFound();
  }

  return <SuiviPanel id={reservationId} />;
}
