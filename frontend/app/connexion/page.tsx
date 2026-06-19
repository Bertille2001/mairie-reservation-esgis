import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Connexion — Mairie de Lomé",
  description:
    "Connexion à l'espace personnel des employés municipaux et gardiens de salle.",
};

export default function ConnexionPage() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <PortalHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <section className="max-w-lg space-y-3">
          <h1 className="font-semibold text-[1.75rem] text-foreground leading-tight tracking-[-0.03em]">
            Espace personnel
          </h1>
          <p className="text-[0.9375rem] text-muted-foreground leading-relaxed">
            Connectez-vous pour accéder à l&apos;espace employé ou gardien de
            salle.
          </p>
        </section>

        <div className="max-w-lg">
          <LoginForm />
        </div>
      </main>
      <PortalFooter />
    </div>
  );
}
