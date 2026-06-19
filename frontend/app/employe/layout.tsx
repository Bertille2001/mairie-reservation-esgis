import { EmployeShell } from "@/components/employe/employe-shell";

export const metadata = {
  title: "Espace employé — Mairie de Lomé",
  description:
    "Traitement des demandes de réservation et suivi des clés et paiements.",
};

export default function EmployeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmployeShell>{children}</EmployeShell>;
}
