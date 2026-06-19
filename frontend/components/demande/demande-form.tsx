"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";

import { TimeRangeFields } from "@/components/portal/time-range-fields";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  buildPlanningUrl,
  createReservationClient,
  DEMANDE_CONFIRMATION_KEY,
  fetchSalleClient,
} from "@/lib/api";
import {
  applyDateInputValue,
  coerceDateRange,
  dateToDateInputValue,
  formatSlotLabel,
  isRangeTimeValid,
  todayRange,
} from "@/lib/dates";
import { firstFieldError, type ApiFieldErrors } from "@/lib/errors";
import { formatCapacite, formatPrice } from "@/lib/format";
import { calculateDemandePrice } from "@/lib/pricing";
import type { DateRange, SalleDetail, TypeDemandeur } from "@/lib/types";

import { FormField, FormSection, formInputClassName } from "./form-field";

interface DemandeFormProps {
  salles: SalleDetail[];
  initialSalleId: number | null;
  initialSlotRange: DateRange | null;
  slotLocked: boolean;
}

const FIELD_ID_MAP: Record<string, string> = {
  salle: "demande-salle",
  date_debut: "demande-date-debut",
  date_fin: "demande-date-fin",
  nom_manifestation: "demande-manifestation",
  nb_personnes: "demande-nb-personnes",
  demandeur_nom: "demande-nom",
  demandeur_email: "demande-email",
  type_demandeur: "demande-type",
};

function scrollToFirstError(errors: ApiFieldErrors) {
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return;
  const el = document.getElementById(FIELD_ID_MAP[firstKey] ?? `demande-${firstKey}`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function DemandeForm({
  salles,
  initialSalleId,
  initialSlotRange,
  slotLocked,
}: DemandeFormProps) {
  const router = useRouter();
  const [salleId, setSalleId] = useState<number | "">(
    initialSalleId ?? (salles[0]?.id ?? ""),
  );
  const [salleDetail, setSalleDetail] = useState<SalleDetail | null>(() => {
    if (initialSalleId) {
      return salles.find((s) => s.id === initialSalleId) ?? null;
    }
    return salles[0] ?? null;
  });
  const [slotRange, setSlotRange] = useState<DateRange>(() =>
    initialSlotRange ? coerceDateRange(initialSlotRange) : todayRange(),
  );
  const [nomManifestation, setNomManifestation] = useState("");
  const [nbPersonnes, setNbPersonnes] = useState("");
  const [demandeurNom, setDemandeurNom] = useState("");
  const [demandeurEmail, setDemandeurEmail] = useState("");
  const [typeDemandeur, setTypeDemandeur] = useState<TypeDemandeur>("particulier");
  const [selectedAppareils, setSelectedAppareils] = useState<number[]>([]);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [validationSummary, setValidationSummary] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadSalleDetail = useCallback(async (id: number) => {
    const cached = salles.find((s) => s.id === id);
    if (cached?.appareils_louables) {
      setSalleDetail(cached);
      return;
    }
    try {
      const detail = await fetchSalleClient(id);
      setSalleDetail(detail);
    } catch {
      setSalleDetail(null);
    }
  }, [salles]);

  const handleSalleChange = (value: string) => {
    const id = Number.parseInt(value, 10);
    if (Number.isNaN(id)) {
      setSalleId("");
      return;
    }
    setSalleId(id);
    setSelectedAppareils([]);
    void loadSalleDetail(id);
  };

  const selectedAppareilItems = useMemo(
    () =>
      salleDetail?.appareils_louables.filter((item) =>
        selectedAppareils.includes(item.id),
      ) ?? [],
    [salleDetail, selectedAppareils],
  );

  const estimatedPrice = useMemo(() => {
    const range = coerceDateRange(slotRange);
    if (!salleDetail || !isRangeTimeValid(range)) return 0;
    return calculateDemandePrice(
      salleDetail,
      range.start,
      range.end,
      typeDemandeur,
      selectedAppareilItems,
    );
  }, [salleDetail, slotRange, typeDemandeur, selectedAppareilItems]);

  const validateClient = (): ApiFieldErrors => {
    const errors: ApiFieldErrors = {};

    if (typeof salleId !== "number") {
      errors.salle = ["Sélectionnez une salle."];
    }
    if (!isRangeTimeValid(coerceDateRange(slotRange))) {
      errors.date_fin = ["L'heure de fin doit être postérieure à l'heure de début."];
    }
    if (!nomManifestation.trim()) {
      errors.nom_manifestation = ["Indiquez le nom de la manifestation."];
    }
    if (!demandeurNom.trim()) {
      errors.demandeur_nom = ["Indiquez votre nom ou celui de l'organisation."];
    }
    if (!demandeurEmail.trim()) {
      errors.demandeur_email = ["Indiquez une adresse e-mail."];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(demandeurEmail)) {
      errors.demandeur_email = ["Adresse e-mail invalide."];
    }

    const nb = Number.parseInt(nbPersonnes, 10);
    if (!nbPersonnes.trim() || Number.isNaN(nb)) {
      errors.nb_personnes = ["Indiquez le nombre de personnes."];
    } else if (salleDetail) {
      if (nb < salleDetail.capacite_min || nb > salleDetail.capacite_max) {
        errors.nb_personnes = [
          `Le nombre de personnes doit être entre ${salleDetail.capacite_min} et ${salleDetail.capacite_max}.`,
        ];
      }
    }

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setGeneralError(null);

    const clientErrors = validateClient();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setValidationSummary("Corrigez les champs signalés avant d'envoyer la demande.");
      scrollToFirstError(clientErrors);
      return;
    }

    setValidationSummary(null);

    if (typeof salleId !== "number") return;

    setSubmitting(true);
    setFieldErrors({});

    const range = coerceDateRange(slotRange);

    const result = await createReservationClient({
      salle: salleId,
      demandeur_nom: demandeurNom.trim(),
      demandeur_email: demandeurEmail.trim(),
      type_demandeur: typeDemandeur,
      nom_manifestation: nomManifestation.trim(),
      nb_personnes: Number.parseInt(nbPersonnes, 10),
      date_debut: range.start.toISOString(),
      date_fin: range.end.toISOString(),
      appareil_ids: selectedAppareils,
    });

    setSubmitting(false);

    if (result.error) {
      setFieldErrors(result.error.fieldErrors);
      setGeneralError(result.error.generalError);
      setValidationSummary(result.error.generalError);
      scrollToFirstError(result.error.fieldErrors);
      return;
    }

    if (result.data) {
      sessionStorage.setItem(
        DEMANDE_CONFIRMATION_KEY,
        JSON.stringify(result.data),
      );
      router.push(`/planning/demande/confirmation?id=${result.data.id}`);
    }
  };

  const toggleAppareil = (id: number) => {
    setSelectedAppareils((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const handleStartDate = (value: string) => {
    setSlotRange((current) => ({
      ...current,
      start: applyDateInputValue(current.start, value),
    }));
  };

  const handleEndDate = (value: string) => {
    setSlotRange((current) => ({
      ...current,
      end: applyDateInputValue(current.end, value),
    }));
  };

  const backHref = slotLocked ? buildPlanningUrl(slotRange) : "/";

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate>
      <Button
        render={<Link href={backHref} />}
        variant="ghost"
        size="sm"
        className="-ml-2 min-h-11 w-fit rounded-lg"
        type="button"
      >
        <ArrowLeft aria-hidden />
        Retour au planning
      </Button>

      {generalError && (
        <Alert variant="error">
          <AlertTitle>Impossible d&apos;envoyer la demande</AlertTitle>
          <AlertDescription>{generalError}</AlertDescription>
        </Alert>
      )}

      <FormSection
        title="Salle et créneau"
        description={
          slotLocked
            ? "Créneau défini depuis le planning. Pour le modifier, revenez à l'accueil."
            : "Choisissez la salle et le créneau souhaité."
        }
      >
        <FormField
          id="demande-salle"
          label="Salle"
          error={firstFieldError(fieldErrors, "salle")}
        >
          {slotLocked && salleDetail ? (
            <p className="font-medium text-foreground text-sm">{salleDetail.nom}</p>
          ) : (
            <select
              id="demande-salle"
              value={salleId}
              onChange={(event) => handleSalleChange(event.target.value)}
              className={formInputClassName}
              required
            >
              <option value="" disabled>
                Sélectionner une salle
              </option>
              {salles.map((salle) => (
                <option key={salle.id} value={salle.id}>
                  {salle.nom}
                </option>
              ))}
            </select>
          )}
        </FormField>

        {slotLocked ? (
          <div className="space-y-2 rounded-lg border border-border/50 bg-surface-grouped px-4 py-3">
            <p className="text-muted-foreground text-xs">Créneau sélectionné</p>
            <p className="font-mono text-foreground text-sm">
              {formatSlotLabel(coerceDateRange(slotRange))}
            </p>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-md focus-visible:text-foreground focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              Modifier sur le planning
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="demande-date-debut"
                label="Date de début"
                error={firstFieldError(fieldErrors, "date_debut")}
              >
                <input
                  id="demande-date-debut"
                  type="date"
                  value={dateToDateInputValue(slotRange.start)}
                  onChange={(event) => handleStartDate(event.target.value)}
                  className={formInputClassName}
                  required
                />
              </FormField>
              <FormField
                id="demande-date-fin"
                label="Date de fin"
                error={firstFieldError(fieldErrors, "date_fin")}
              >
                <input
                  id="demande-date-fin"
                  type="date"
                  value={dateToDateInputValue(slotRange.end)}
                  onChange={(event) => handleEndDate(event.target.value)}
                  min={dateToDateInputValue(slotRange.start)}
                  className={formInputClassName}
                  required
                />
              </FormField>
            </div>
            <TimeRangeFields
              idPrefix="demande"
              range={slotRange}
              onRangeChange={setSlotRange}
            />
          </>
        )}

        {salleDetail && (
          <p className="text-muted-foreground text-xs">
            Capacité : {formatCapacite(salleDetail.capacite_min, salleDetail.capacite_max)}
          </p>
        )}
      </FormSection>

      <FormSection title="Manifestation" description="Informations sur votre événement.">
        <FormField
          id="demande-manifestation"
          label="Nom de la manifestation"
          error={firstFieldError(fieldErrors, "nom_manifestation")}
        >
          <input
            id="demande-manifestation"
            type="text"
            value={nomManifestation}
            onChange={(event) => setNomManifestation(event.target.value)}
            className={formInputClassName}
            placeholder="Ex. Assemblée générale, formation…"
            required
          />
        </FormField>

        <FormField
          id="demande-nb-personnes"
          label="Nombre de personnes"
          hint={
            salleDetail
              ? `Entre ${salleDetail.capacite_min} et ${salleDetail.capacite_max}`
              : undefined
          }
          error={firstFieldError(fieldErrors, "nb_personnes")}
        >
          <input
            id="demande-nb-personnes"
            type="number"
            min={salleDetail?.capacite_min ?? 1}
            max={salleDetail?.capacite_max ?? undefined}
            value={nbPersonnes}
            onChange={(event) => setNbPersonnes(event.target.value)}
            className={formInputClassName}
            required
          />
        </FormField>
      </FormSection>

      <FormSection title="Demandeur" description="Coordonnées pour le suivi de votre demande.">
        <FormField
          id="demande-type"
          label="Type de demandeur"
          error={firstFieldError(fieldErrors, "type_demandeur")}
        >
          <div className="grid grid-cols-2 gap-2">
            {(["particulier", "organisation"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTypeDemandeur(type)}
                className={`min-h-11 rounded-lg border px-3 text-sm transition-colors ${
                  typeDemandeur === type
                    ? "border-primary bg-primary/8 font-medium text-foreground"
                    : "border-border/60 bg-surface-grouped text-muted-foreground hover:text-foreground"
                }`}
              >
                {type === "particulier" ? "Particulier" : "Organisation"}
              </button>
            ))}
          </div>
          {typeDemandeur === "organisation" && (
            <p className="mt-2 text-muted-foreground text-xs">
              Les organisations ne sont pas facturées pour la location de salle,
              uniquement pour le matériel loué.
            </p>
          )}
        </FormField>

        <FormField
          id="demande-nom"
          label={typeDemandeur === "organisation" ? "Nom de l'organisation" : "Nom du demandeur"}
          error={firstFieldError(fieldErrors, "demandeur_nom")}
        >
          <input
            id="demande-nom"
            type="text"
            value={demandeurNom}
            onChange={(event) => setDemandeurNom(event.target.value)}
            className={formInputClassName}
            required
          />
        </FormField>

        <FormField
          id="demande-email"
          label="E-mail de contact"
          error={firstFieldError(fieldErrors, "demandeur_email")}
        >
          <input
            id="demande-email"
            type="email"
            value={demandeurEmail}
            onChange={(event) => setDemandeurEmail(event.target.value)}
            className={formInputClassName}
            autoComplete="email"
            required
          />
        </FormField>
      </FormSection>

      {salleDetail && salleDetail.appareils_louables.length > 0 && (
        <FormSection
          title="Matériel supplémentaire"
          description="Optionnel — équipements louables pour cette salle."
        >
          <ul className="divide-y divide-border/50 rounded-lg border border-border/50">
            {salleDetail.appareils_louables.map((appareil) => {
              const checked = selectedAppareils.includes(appareil.id);
              return (
                <li key={appareil.id}>
                  <label className="flex min-h-[52px] cursor-pointer items-center gap-3 px-4 py-3 active:bg-accent/40">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAppareil(appareil.id)}
                      className="size-5 shrink-0 rounded border-border accent-primary"
                    />
                    <span className="min-w-0 flex-1 break-words text-sm text-foreground">
                      {appareil.nom}
                    </span>
                    <span className="font-mono text-muted-foreground text-sm">
                      {formatPrice(appareil.prix)}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </FormSection>
      )}

      <section className="rounded-xl border border-border/60 bg-surface-elevated p-4 shadow-panel sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-medium text-foreground text-sm">Estimation du prix</p>
            <p className="font-mono text-[1.125rem] text-foreground tracking-tight">
              {formatPrice(estimatedPrice)}
            </p>
            <p className="text-muted-foreground text-xs">
              Montant indicatif. Le tarif définitif sera confirmé par la mairie.
            </p>
            {validationSummary && (
              <p className="text-destructive text-xs" role="alert">
                {validationSummary}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting || !isRangeTimeValid(coerceDateRange(slotRange))}
            className="inline-flex min-h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-4 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-64 sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Envoi en cours…
              </>
            ) : (
              "Envoyer la demande"
            )}
          </button>
        </div>
      </section>

      <p className="text-muted-foreground text-xs">
        Une fois envoyée, votre demande ne pourra plus être modifiée en ligne.
        Vous recevrez une réponse par e-mail après traitement par un agent municipal.
      </p>
    </form>
  );
}
