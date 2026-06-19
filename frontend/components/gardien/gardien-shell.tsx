"use client";

import { useEffect, useState, type ReactNode } from "react";

import { GardienHeader } from "@/components/gardien/gardien-header";
import { EmployePageSkeleton } from "@/components/employe/employe-page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { AuthError, fetchMe } from "@/lib/api-auth";
import { fetchSalleClient } from "@/lib/api";
import { clearTokens, isAuthenticated } from "@/lib/auth";
import type { User } from "@/lib/types";
import { AlertCircle } from "lucide-react";

interface GardienShellProps {
  children: ReactNode;
}

export function GardienShell({ children }: GardienShellProps) {
  const [user, setUser] = useState<User | null>(null);
  const [salleNom, setSalleNom] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.replace("/connexion");
      return;
    }

    fetchMe()
      .then(async (profile) => {
        if (profile.role !== "gardien") {
          window.location.replace(
            profile.role === "employe_municipal" ? "/employe" : "/connexion",
          );
          return;
        }

        if (!profile.salle) {
          setConfigError(
            "Aucune salle ne vous est assignée. Contactez un employé municipal.",
          );
          setUser(profile);
          setLoading(false);
          return;
        }

        const salle = await fetchSalleClient(profile.salle);
        setUser(profile);
        setSalleNom(salle.nom);
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
    return <EmployePageSkeleton />;
  }

  if (configError || !user) {
    return (
      <div className="flex min-h-full flex-col bg-background">
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
          <EmptyState
            icon={AlertCircle}
            title="Accès impossible"
            description={
              configError ??
              "Votre compte gardien n'est pas configuré correctement."
            }
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-background">
      <GardienHeader user={user} salleNom={salleNom} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
