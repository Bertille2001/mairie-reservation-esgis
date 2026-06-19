"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";

import { FormField, FormSection, formInputClassName } from "@/components/demande/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { fetchMe, loginClient } from "@/lib/api-auth";
import { getRoleHomePath } from "@/lib/auth";
import { firstFieldError, type ApiFieldErrors } from "@/lib/errors";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setGeneralError(null);
    setFieldErrors({});

    const result = await loginClient(email.trim(), password);

    if (result.error) {
      setGeneralError(result.error.generalError);
      setFieldErrors(result.error.fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const user = await fetchMe();
      router.replace(getRoleHomePath(user.role));
    } catch {
      setGeneralError("Connexion réussie, mais impossible de charger le profil.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {generalError && (
        <Alert variant="error" className="rounded-xl">
          <AlertTitle>Connexion impossible</AlertTitle>
          <AlertDescription>{generalError}</AlertDescription>
        </Alert>
      )}

      <FormSection
        title="Identifiants"
        description="Accès réservé aux agents municipaux et gardiens de salle."
      >
        <FormField
          id="login-email"
          label="Adresse e-mail"
          error={firstFieldError(fieldErrors, "email")}
        >
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={formInputClassName}
            autoComplete="email"
            required
            disabled={loading}
          />
        </FormField>

        <FormField
          id="login-password"
          label="Mot de passe"
          error={firstFieldError(fieldErrors, "password")}
        >
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={formInputClassName}
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </FormField>
      </FormSection>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          className="min-h-11 w-full rounded-lg sm:w-auto"
          loading={loading}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Connexion…
            </>
          ) : (
            <>
              <LogIn aria-hidden />
              Se connecter
            </>
          )}
        </Button>
        <Button
          render={<Link href="/" />}
          variant="ghost"
          className="min-h-11 rounded-lg"
        >
          Retour au portail public
        </Button>
      </div>
    </form>
  );
}
