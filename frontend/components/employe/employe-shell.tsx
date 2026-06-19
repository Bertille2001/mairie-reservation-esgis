"use client";

import { useEffect, useState, type ReactNode } from "react";

import { EmployeHeader } from "@/components/employe/employe-header";
import { EmployePageSkeleton } from "@/components/employe/employe-page-skeleton";
import { AuthError, fetchMe } from "@/lib/api-auth";
import { clearTokens, isAuthenticated } from "@/lib/auth";
import type { User } from "@/lib/types";

interface EmployeShellProps {
  children: ReactNode;
}

export function EmployeShell({ children }: EmployeShellProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.replace("/connexion");
      return;
    }

    fetchMe()
      .then((profile) => {
        if (profile.role !== "employe_municipal") {
          window.location.replace(
            profile.role === "gardien" ? "/gardien" : "/connexion",
          );
          return;
        }
        setUser(profile);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof AuthError) {
          clearTokens();
        }
        window.location.replace("/connexion");
      });
  }, []);

  if (loading || !user) {
    return <EmployePageSkeleton />;
  }

  return (
    <div className="flex min-h-full flex-col bg-background">
      <EmployeHeader user={user} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
