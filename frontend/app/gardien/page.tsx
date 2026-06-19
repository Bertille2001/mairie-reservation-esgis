"use client";

import { useEffect, useState } from "react";

import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";
import { EmployePageSkeleton } from "@/components/employe/employe-page-skeleton";
import { Button } from "@/components/ui/button";
import { AuthError, fetchMe } from "@/lib/api-auth";
import { clearTokens, isAuthenticated } from "@/lib/auth";

export default function GardienPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.replace("/connexion");
      return;
    }

    fetchMe()
      .then((user) => {
        if (user.role !== "gardien") {
          window.location.replace(
            user.role === "employe_municipal" ? "/employe" : "/connexion",
          );
          return;
        }
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof AuthError) {
          clearTokens();
        }
        window.location.replace("/connexion");
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-full flex-col bg-background">
        <PortalHeader />
        <EmployePageSkeleton />
        <PortalFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-background">
      <PortalHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="max-w-3xl space-y-3">
          <h1 className="font-semibold text-[1.75rem] text-foreground leading-tight tracking-[-0.03em]">
            Espace gardien
          </h1>
          <p className="text-[0.9375rem] text-muted-foreground leading-relaxed">
            Cette section sera disponible prochainement. Vous pourrez y consulter
            le planning de votre salle et enregistrer la remise et la
            restitution des clés.
          </p>
        </section>
        <Button
          type="button"
          variant="ghost"
          className="min-h-11 w-fit rounded-lg"
          onClick={() => {
            clearTokens();
            window.location.replace("/connexion");
          }}
        >
          Se déconnecter
        </Button>
      </main>
      <PortalFooter />
    </div>
  );
}
