import { notFound } from "next/navigation";

import { DemandeDetailPanel } from "@/components/employe/demande-detail-panel";

export const metadata = {
  title: "Détail demande — Espace employé",
};

export default async function DemandeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const demandeId = Number.parseInt(id, 10);

  if (Number.isNaN(demandeId)) {
    notFound();
  }

  return <DemandeDetailPanel id={demandeId} />;
}
