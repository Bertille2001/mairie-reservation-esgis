"use client";

import Link from "next/link";
import { useState } from "react";
import { Save } from "lucide-react";

import { FormField, FormSection, formInputClassName } from "@/components/demande/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { updateSuivi } from "@/lib/api-auth";
import {
  applyDateInputValue,
  applyTimeInputValue,
  dateToDateInputValue,
  dateToTimeInputValue,
} from "@/lib/dates";
import { firstFieldError, type ApiFieldErrors } from "@/lib/errors";
import { formatDateTimeFr, formatPrice } from "@/lib/format";
import type { DemandeReservation, SuiviCles } from "@/lib/types";

interface SuiviFormProps {
  demande: DemandeReservation;
  suivi: SuiviCles;
  onUpdate: (updated: SuiviCles) => void;
}

function parseDatetimeToFields(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "", time: "" };
  return {
    date: dateToDateInputValue(d),
    time: dateToTimeInputValue(d),
  };
}

function fieldsToIso(date: string, time: string): string | undefined {
  if (!date || !time) return undefined;
  let d = new Date();
  d = applyDateInputValue(d, date);
  d = applyTimeInputValue(d, time);
  return d.toISOString();
}

export function SuiviForm({ demande, suivi, onUpdate }: SuiviFormProps) {
  const remiseInit = parseDatetimeToFields(suivi.date_remise_reelle);
  const restitutionInit = parseDatetimeToFields(suivi.date_restitution_reelle);

  const [remiseDate, setRemiseDate] = useState(remiseInit.date);
  const [remiseTime, setRemiseTime] = useState(remiseInit.time);
  const [restitutionDate, setRestitutionDate] = useState(restitutionInit.date);
  const [restitutionTime, setRestitutionTime] = useState(restitutionInit.time);
  const [paiementEffectue, setPaiementEffectue] = useState(suivi.paiement_effectue);
  const [montantPaye, setMontantPaye] = useState(
    suivi.montant_paye != null ? String(suivi.montant_paye) : "",
  );
  const [clesRendues, setClesRendues] = useState(suivi.cles_rendues === true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    const payload = {
      date_remise_reelle: fieldsToIso(remiseDate, remiseTime),
      date_restitution_reelle: fieldsToIso(restitutionDate, restitutionTime),
      paiement_effectue: paiementEffectue,
      montant_paye: montantPaye.trim() ? montantPaye.trim() : undefined,
      cles_rendues: clesRendues,
    };

    const result = await updateSuivi(demande.id, payload);

    if (result.error) {
      setError(result.error.generalError);
      setFieldErrors(result.error.fieldErrors);
      setLoading(false);
      return;
    }

    if (result.data) {
      onUpdate(result.data);
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <section className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5">
        <h2 className="mb-1 font-semibold text-base text-foreground tracking-[-0.01em]">
          Réservation n° {demande.id}
        </h2>
        <p className="text-muted-foreground text-sm">
          {demande.nom_manifestation} — {demande.salle_nom}
        </p>
        <p className="mt-2 font-mono text-muted-foreground text-sm">
          Prix estimé : {formatPrice(demande.prix_total)}
        </p>
        <Button
          render={<Link href={`/employe/demandes/${demande.id}`} />}
          variant="link"
          className="mt-2 h-auto min-h-0 p-0 text-sm"
        >
          Voir le détail de la demande
        </Button>
      </section>

      {success && (
        <Alert variant="success" className="rounded-xl">
          <AlertTitle>Enregistrement réussi</AlertTitle>
          <AlertDescription>
            Le suivi des clés et du paiement a été mis à jour.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="error" className="rounded-xl">
          <AlertTitle>Enregistrement impossible</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FormSection
        title="Remise des clés"
        description={`Prévue le ${formatDateTimeFr(suivi.date_remise_prevue)}.`}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="remise-date" label="Date de remise">
            <input
              id="remise-date"
              type="date"
              value={remiseDate}
              onChange={(event) => setRemiseDate(event.target.value)}
              className={formInputClassName}
              disabled={loading}
            />
          </FormField>
          <FormField id="remise-time" label="Heure de remise">
            <input
              id="remise-time"
              type="time"
              value={remiseTime}
              onChange={(event) => setRemiseTime(event.target.value)}
              className={formInputClassName}
              disabled={loading}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Paiement">
        <label className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-lg border border-border/50 px-4 py-3">
          <input
            type="checkbox"
            checked={paiementEffectue}
            onChange={(event) => setPaiementEffectue(event.target.checked)}
            className="size-5 shrink-0 rounded border-border accent-primary"
            disabled={loading}
          />
          <span className="text-sm text-foreground">Paiement effectué</span>
        </label>

        <FormField
          id="montant-paye"
          label="Montant payé (FCFA)"
          error={firstFieldError(fieldErrors, "montant_paye")}
        >
          <input
            id="montant-paye"
            type="number"
            min="0"
            step="1"
            value={montantPaye}
            onChange={(event) => setMontantPaye(event.target.value)}
            className={formInputClassName}
            disabled={loading || !paiementEffectue}
            placeholder="Ex. 45000"
          />
        </FormField>
      </FormSection>

      <FormSection
        title="Restitution des clés"
        description={`Prévue le ${formatDateTimeFr(suivi.date_restitution_prevue)}.`}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="restitution-date" label="Date de restitution">
            <input
              id="restitution-date"
              type="date"
              value={restitutionDate}
              onChange={(event) => setRestitutionDate(event.target.value)}
              className={formInputClassName}
              disabled={loading}
            />
          </FormField>
          <FormField id="restitution-time" label="Heure de restitution">
            <input
              id="restitution-time"
              type="time"
              value={restitutionTime}
              onChange={(event) => setRestitutionTime(event.target.value)}
              className={formInputClassName}
              disabled={loading}
            />
          </FormField>
        </div>

        <label className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-lg border border-border/50 px-4 py-3">
          <input
            type="checkbox"
            checked={clesRendues}
            onChange={(event) => setClesRendues(event.target.checked)}
            className="size-5 shrink-0 rounded border-border accent-primary"
            disabled={loading}
          />
          <span className="text-sm text-foreground">Clés rendues</span>
        </label>
      </FormSection>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          className="min-h-11 rounded-lg"
          loading={loading}
        >
          <Save aria-hidden />
          Enregistrer le suivi
        </Button>
        <Button
          render={<Link href="/employe?statut=acceptee" />}
          variant="ghost"
          className="min-h-11 rounded-lg"
        >
          Retour aux réservations
        </Button>
      </div>
    </form>
  );
}
