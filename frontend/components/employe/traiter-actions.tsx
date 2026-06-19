"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, X } from "lucide-react";

import { FormField, formInputClassName } from "@/components/demande/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { traiterDemande } from "@/lib/api-auth";
import { firstFieldError, type ApiFieldErrors } from "@/lib/errors";
import { showErrorToast, showSuccessToast } from "@/lib/ui-toast";
import type { DemandeReservation } from "@/lib/types";

interface TraiterActionsProps {
  demande: DemandeReservation;
  onTraite: (updated: DemandeReservation) => void;
}

export function TraiterActions({ demande, onTraite }: TraiterActionsProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "refuse">("idle");
  const [raisonRefus, setRaisonRefus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});

  if (demande.statut !== "en_attente") {
    if (demande.statut === "acceptee") {
      return (
        <section className="rounded-xl border border-success/32 bg-success/4 p-4 sm:p-5">
          <p className="font-medium text-foreground text-sm">
            Cette demande a été acceptée.
          </p>
          <p className="mt-1 text-muted-foreground text-sm">
            Enregistrez la remise des clés et le paiement depuis le suivi de
            réservation.
          </p>
          <Button
            render={<Link href={`/employe/reservations/${demande.id}`} />}
            className="mt-4 min-h-11 rounded-lg"
          >
            Suivi clés et paiement
          </Button>
        </section>
      );
    }
    return null;
  }

  async function handleAccepter() {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const result = await traiterDemande(demande.id, { statut: "acceptee" });

    if (result.error) {
      setError(result.error.generalError);
      setFieldErrors(result.error.fieldErrors);
      showErrorToast("Action impossible", result.error.generalError);
      setLoading(false);
      return;
    }

    if (result.data) {
      onTraite(result.data);
      showSuccessToast(
        "Demande acceptée",
        "Redirection vers le suivi clés et paiement.",
      );
      router.push(`/employe/reservations/${demande.id}`);
    }
    setLoading(false);
  }

  async function handleRefuser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!raisonRefus.trim()) {
      setFieldErrors({ raison_refus: ["La raison du refus est obligatoire."] });
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    const result = await traiterDemande(demande.id, {
      statut: "refusee",
      raison_refus: raisonRefus.trim(),
    });

    if (result.error) {
      setError(result.error.generalError);
      setFieldErrors(result.error.fieldErrors);
      showErrorToast("Action impossible", result.error.generalError);
      setLoading(false);
      return;
    }

    if (result.data) {
      onTraite(result.data);
      showSuccessToast(
        "Demande refusée",
        "Le demandeur sera informé par e-mail.",
      );
      setMode("idle");
    }
    setLoading(false);
  }

  return (
    <section className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5">
      <h2 className="mb-4 font-semibold text-base text-foreground tracking-[-0.01em]">
        Traitement de la demande
      </h2>

      {error && (
        <Alert variant="error" className="mb-4 rounded-xl">
          <AlertTitle>Action impossible</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {mode === "idle" ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            className="min-h-11 flex-1 rounded-lg"
            loading={loading}
            onClick={handleAccepter}
          >
            <Check aria-hidden />
            Accepter la demande
          </Button>
          <Button
            type="button"
            variant="destructive-outline"
            className="min-h-11 flex-1 rounded-lg"
            disabled={loading}
            onClick={() => setMode("refuse")}
          >
            <X aria-hidden />
            Refuser la demande
          </Button>
        </div>
      ) : (
        <form onSubmit={handleRefuser} className="space-y-4">
          <FormField
            id="raison-refus"
            label="Motif du refus"
            hint="Ce message sera transmis au demandeur par e-mail."
            error={firstFieldError(fieldErrors, "raison_refus")}
          >
            <textarea
              id="raison-refus"
              value={raisonRefus}
              onChange={(event) => setRaisonRefus(event.target.value)}
              rows={4}
              className={`${formInputClassName} min-h-[120px] resize-y py-2.5`}
              required
              disabled={loading}
            />
          </FormField>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="submit"
              variant="destructive"
              className="min-h-11 flex-1 rounded-lg"
              loading={loading}
            >
              Confirmer le refus
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="min-h-11 rounded-lg"
              disabled={loading}
              onClick={() => {
                setMode("idle");
                setRaisonRefus("");
                setFieldErrors({});
              }}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
