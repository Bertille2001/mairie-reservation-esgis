"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BellRing, Clock, Save } from "lucide-react";

import { KeyTrackingTimeline } from "@/components/suivi/key-tracking-timeline";
import { FormField, formInputClassName } from "@/components/demande/form-field";
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
import { formatPrice, formatShortDateTime } from "@/lib/format";
import {
  getCurrentKeyTrackingStep,
  getKeyTrackingStatus,
  isHandoverStepComplete,
  isReturnStepComplete,
} from "@/lib/suivi-status";
import { showErrorToast, showSuccessToast } from "@/lib/ui-toast";
import type { DemandeReservation, SuiviCles } from "@/lib/types";

export type KeyTrackingSuiviVariant = "employe" | "gardien";

interface KeyTrackingSuiviFormProps {
  demande: DemandeReservation;
  suivi: SuiviCles;
  onUpdate: (updated: SuiviCles) => void;
  variant: KeyTrackingSuiviVariant;
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

function nowFields(): { date: string; time: string } {
  const d = new Date();
  return {
    date: dateToDateInputValue(d),
    time: dateToTimeInputValue(d),
  };
}

export function KeyTrackingSuiviForm({
  demande,
  suivi,
  onUpdate,
  variant,
}: KeyTrackingSuiviFormProps) {
  const isEmploye = variant === "employe";
  const backHref = isEmploye ? "/employe?statut=acceptee" : "/gardien";

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
  const [signalingDelay, setSignalingDelay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});

  const status = getKeyTrackingStatus(suivi);
  const currentStep = getCurrentKeyTrackingStep(suivi);
  const handoverDone = isHandoverStepComplete(suivi);
  const returnDone = isReturnStepComplete(suivi);

  const primaryLabel = useMemo(() => {
    if (returnDone) return "Enregistrer";
    if (currentStep === 1 || !handoverDone) return "Enregistrer la remise";
    return "Enregistrer la restitution";
  }, [currentStep, handoverDone, returnDone]);

  function applyNowToHandover() {
    const { date, time } = nowFields();
    setRemiseDate(date);
    setRemiseTime(time);
  }

  function applyNowToReturn() {
    const { date, time } = nowFields();
    setRestitutionDate(date);
    setRestitutionTime(time);
    setClesRendues(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const payload = {
      date_remise_reelle: fieldsToIso(remiseDate, remiseTime),
      date_restitution_reelle: fieldsToIso(restitutionDate, restitutionTime),
      ...(clesRendues ? { cles_rendues: true as const } : {}),
      ...(isEmploye
        ? {
            paiement_effectue: paiementEffectue,
            montant_paye: montantPaye.trim() ? montantPaye.trim() : undefined,
          }
        : {}),
    };

    const result = await updateSuivi(demande.id, payload);

    if (result.error) {
      setError(result.error.generalError);
      setFieldErrors(result.error.fieldErrors);
      showErrorToast("Enregistrement impossible", result.error.generalError);
      setLoading(false);
      return;
    }

    if (result.data) {
      onUpdate(result.data);
      showSuccessToast("Enregistré");
    }
    setLoading(false);
  }

  async function handleSignalDelay() {
    setSignalingDelay(true);
    setError(null);

    const result = await updateSuivi(demande.id, { cles_rendues: false });

    if (result.error) {
      setError(result.error.generalError);
      showErrorToast("Signalement impossible", result.error.generalError);
      setSignalingDelay(false);
      return;
    }

    if (result.data) {
      onUpdate(result.data);
      setClesRendues(false);
      showSuccessToast("Retard signalé");
    }
    setSignalingDelay(false);
  }

  const showHandoverForm = !returnDone && (currentStep === 1 || !handoverDone);
  const showReturnForm = handoverDone && !returnDone;
  const showEditForm = returnDone;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <section className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-muted-foreground text-xs">n° {demande.id}</p>
            <h2 className="mt-1 font-semibold text-lg text-foreground tracking-[-0.02em]">
              {demande.nom_manifestation}
            </h2>
            <p className="mt-1 text-muted-foreground text-sm">
              {demande.salle_nom}
            </p>
            <p className="mt-1 font-mono text-muted-foreground text-xs">
              {formatShortDateTime(demande.date_debut)}
              {" → "}
              {formatShortDateTime(demande.date_fin)}
            </p>
          </div>
          {isEmploye && (
            <p className="font-mono text-foreground text-sm">
              {formatPrice(demande.prix_total)}
            </p>
          )}
        </div>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground text-xs">Demandeur</dt>
            <dd className="text-foreground">{demande.demandeur_nom}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs">Contact</dt>
            <dd className="break-all text-foreground">{demande.demandeur_email}</dd>
          </div>
        </dl>
        {isEmploye && (
          <Button
            render={<Link href={`/employe/demandes/${demande.id}`} />}
            variant="link"
            className="mt-2 h-auto min-h-0 p-0 text-sm"
          >
            Voir la demande
          </Button>
        )}
      </section>

      <KeyTrackingTimeline suivi={suivi} />

      {error && (
        <Alert variant="error" className="rounded-xl">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(status === "overdue_handover" || status === "overdue_return") && (
        <Alert variant="warning" className="rounded-xl">
          <AlertTitle>
            {status === "overdue_handover" ? "Remise en retard" : "Restitution en retard"}
          </AlertTitle>
        </Alert>
      )}

      {(showHandoverForm || showEditForm) && (
        <section className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5">
          <h3 className="font-semibold text-base text-foreground tracking-[-0.01em]">
            Remise
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField id="remise-date" label="Date">
              <input
                id="remise-date"
                type="date"
                value={remiseDate}
                onChange={(event) => setRemiseDate(event.target.value)}
                className={formInputClassName}
                disabled={loading || signalingDelay}
              />
            </FormField>
            <FormField id="remise-time" label="Heure">
              <input
                id="remise-time"
                type="time"
                value={remiseTime}
                onChange={(event) => setRemiseTime(event.target.value)}
                className={formInputClassName}
                disabled={loading || signalingDelay}
              />
            </FormField>
          </div>
          {!showEditForm && (
            <Button
              type="button"
              variant="outline"
              className="mt-3 min-h-11 rounded-lg"
              disabled={loading || signalingDelay}
              onClick={applyNowToHandover}
            >
              <Clock aria-hidden />
              Maintenant
            </Button>
          )}
        </section>
      )}

      {isEmploye && (showReturnForm || showHandoverForm || showEditForm) && (
        <section className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5">
          <h3 className="font-semibold text-base text-foreground tracking-[-0.01em]">
            Paiement
          </h3>
          <label className="mt-4 flex min-h-[52px] cursor-pointer items-center gap-3 rounded-lg border border-border/50 px-4 py-3">
            <input
              type="checkbox"
              checked={paiementEffectue}
              onChange={(event) => setPaiementEffectue(event.target.checked)}
              className="size-5 shrink-0 rounded border-border accent-primary"
              disabled={loading || signalingDelay}
            />
            <span className="text-sm text-foreground">Payé</span>
          </label>
          <FormField
            id="montant-paye"
            label="Montant (FCFA)"
            error={firstFieldError(fieldErrors, "montant_paye")}
            className="mt-4"
          >
            <input
              id="montant-paye"
              type="number"
              min="0"
              step="1"
              value={montantPaye}
              onChange={(event) => setMontantPaye(event.target.value)}
              className={formInputClassName}
              disabled={loading || !paiementEffectue || signalingDelay}
              placeholder={demande.prix_total ? String(demande.prix_total) : undefined}
            />
          </FormField>
        </section>
      )}

      {(showReturnForm || showEditForm) && (
        <section className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5">
          <h3 className="font-semibold text-base text-foreground tracking-[-0.01em]">
            Restitution
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField id="restitution-date" label="Date">
              <input
                id="restitution-date"
                type="date"
                value={restitutionDate}
                onChange={(event) => setRestitutionDate(event.target.value)}
                className={formInputClassName}
                disabled={loading || signalingDelay}
              />
            </FormField>
            <FormField id="restitution-time" label="Heure">
              <input
                id="restitution-time"
                type="time"
                value={restitutionTime}
                onChange={(event) => setRestitutionTime(event.target.value)}
                className={formInputClassName}
                disabled={loading || signalingDelay}
              />
            </FormField>
          </div>

          <label className="mt-4 flex min-h-[52px] cursor-pointer items-center gap-3 rounded-lg border border-border/50 px-4 py-3">
            <input
              type="checkbox"
              checked={clesRendues}
              onChange={(event) => setClesRendues(event.target.checked)}
              className="size-5 shrink-0 rounded border-border accent-primary"
              disabled={loading || signalingDelay}
            />
            <span className="text-sm text-foreground">Clés rendues</span>
          </label>

          {!showEditForm && (
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                variant="outline"
                className="min-h-11 rounded-lg"
                disabled={loading || signalingDelay}
                onClick={applyNowToReturn}
              >
                <Clock aria-hidden />
                Maintenant
              </Button>
              {!clesRendues && (
                <Button
                  type="button"
                  variant="ghost"
                  className="min-h-11 rounded-lg"
                  loading={signalingDelay}
                  disabled={loading}
                  onClick={() => void handleSignalDelay()}
                >
                  <BellRing aria-hidden />
                  Signaler retard
                </Button>
              )}
            </div>
          )}
        </section>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          className="min-h-11 rounded-lg"
          loading={loading}
          disabled={signalingDelay}
        >
          <Save aria-hidden />
          {primaryLabel}
        </Button>
        <Button
          render={<Link href={backHref} />}
          variant="ghost"
          className="min-h-11 rounded-lg"
        >
          Retour
        </Button>
      </div>
    </form>
  );
}
